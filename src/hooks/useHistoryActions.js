"use client";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import jsPDF from "jspdf";
import toast from "react-hot-toast";
import { supabase } from "@/integrations/supabase/client";
import { collectImageUrls } from "@/utils/imageUrlUtils";

/** Maximum simultaneous image fetches to avoid network saturation */
const DOWNLOAD_CONCURRENCY = 3;

/**
 * Run async tasks with a capped concurrency pool.
 * @param {Array} items
 * @param {number} limit - max parallel tasks
 * @param {(item: any, index: number) => Promise<any>} worker
 */
async function pooledMap(items, limit, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function runWorker() {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await worker(items[index], index);
    }
  }

  const pool = Array.from({ length: Math.min(limit, items.length) }, runWorker);
  await Promise.all(pool);
  return results;
}

export const useHistoryActions = () => {
  const fetchDownloadImageUrls = async (item) => {
    if (!item?.id) {
      throw new Error("History item not found");
    }

    const { data, error } = await supabase
      .from("generated_images")
      .select("image_urls")
      .eq("id", item.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return collectImageUrls(data?.image_urls);
  };

  const handleDownloadImage = async (item, index) => {
    try {
      const imageUrls = await fetchDownloadImageUrls(item);
      const url = imageUrls[index];

      if (!url) {
        throw new Error("Image URL not found");
      }

      saveAs(url, `image-${index + 1}.jpg`);
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Failed to download image. The file may have been deleted.");
    }
  };

  /**
   * Start a ZIP download with real-time progress reporting.
   *
   * @param {object} item - history item
   * @param {object} callbacks
   * @param {(state: DownloadState) => void} callbacks.onProgress  - called on each update
   * @param {() => void}                     callbacks.onComplete  - called after saveAs
   * @param {(err: Error) => void}           callbacks.onError     - called on fatal error
   * @param {AbortSignal}                    callbacks.signal      - cancellation signal
   *
   * DownloadState shape:
   *   { phase: 'fetching'|'zipping'|'saving', fetched: number, total: number, zipPercent: number }
   */
  const startDownloadAll = async (item, { onProgress, onComplete, onError, signal } = {}) => {
    const report = (state) => {
      if (typeof onProgress === "function") onProgress(state);
    };

    try {
      report({ phase: "fetching", fetched: 0, total: 0, zipPercent: 0 });

      const imageUrls = await fetchDownloadImageUrls(item);
      const validImages = imageUrls.filter(Boolean);

      if (validImages.length === 0) {
        throw new Error("No valid images found to download");
      }

      report({ phase: "fetching", fetched: 0, total: validImages.length, zipPercent: 0 });

      const zip = new JSZip();
      let fetched = 0;
      let errors = 0;

      await pooledMap(validImages, DOWNLOAD_CONCURRENCY, async (url, index) => {
        if (signal?.aborted) return;

        try {
          const response = await fetch(url, { signal });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const blob = await response.blob();
          zip.file(`image-${index + 1}.jpg`, blob);
          fetched++;
        } catch (err) {
          if (err?.name === "AbortError") throw err; // re-throw cancellations
          console.error(`Failed to fetch image ${index + 1}:`, err);
          errors++;
          fetched++;
        }

        report({
          phase: "fetching",
          fetched,
          total: validImages.length,
          zipPercent: 0,
        });
      });

      if (signal?.aborted) return;

      const successCount = fetched - errors;
      if (successCount === 0) {
        throw new Error("Failed to download any images");
      }

      // ZIP compression phase
      report({ phase: "zipping", fetched, total: validImages.length, zipPercent: 0 });

      const content = await zip.generateAsync(
        {
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: { level: 3 }, // fast compression, good for images
        },
        (metadata) => {
          if (signal?.aborted) return;
          report({
            phase: "zipping",
            fetched,
            total: validImages.length,
            zipPercent: Math.round(metadata.percent),
          });
        },
      );

      if (signal?.aborted) return;

      report({ phase: "saving", fetched, total: validImages.length, zipPercent: 100 });

      const fileName = `${(item.productName || "images").replace(/\s+/g, "-").toLowerCase()}.zip`;
      saveAs(content, fileName);

      if (typeof onComplete === "function") {
        onComplete({ successCount, errorCount: errors, total: validImages.length });
      }
    } catch (err) {
      if (err?.name === "AbortError") return; // user cancelled — silent
      console.error("ZIP download failed:", err);
      if (typeof onError === "function") {
        onError(err);
      }
    }
  };

  const handleExportPDF = async (item) => {
    const toastId = toast.loading("Preparing PDF...");

    try {
      const imageUrls = await fetchDownloadImageUrls(item);
      const validImages = imageUrls.filter(Boolean);

      if (validImages.length === 0) {
        toast.dismiss(toastId);
        toast.error("No valid images found to export");
        return;
      }

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let addedPageCount = 0;

      const promises = validImages.map((url) => {
        return new Promise((resolve) => {
          const image = new Image();
          image.src = url;
          image.crossOrigin = "anonymous";
          image.onload = () => {
            const maxImgWidth = 400;
            const imgWidth = maxImgWidth;
            const imgHeight = (image.height / image.width) * imgWidth;
            const x = (pageWidth - imgWidth) / 2;
            const y = (pageHeight - imgHeight) / 2;
            pdf.addImage(image, "JPEG", x, y, imgWidth, imgHeight);
            pdf.addPage();
            addedPageCount++;
            resolve();
          };
          image.onerror = () => {
            console.error("Failed to load image for PDF:", url);
            resolve();
          };
        });
      });

      await Promise.all(promises);

      if (addedPageCount === 0) {
        toast.dismiss(toastId);
        toast.error("Failed to load images for PDF");
        return;
      }

      pdf.deletePage(pdf.getNumberOfPages());
      pdf.save(`${item.productName || "catalog"}.pdf`);
      toast.dismiss(toastId);
      toast.success("PDF exported successfully");
    } catch (error) {
      console.error("PDF export failed:", error);
      toast.dismiss(toastId);
      toast.error("Failed to export PDF");
    }
  };

  return {
    handleDownloadImage,
    startDownloadAll,
    handleExportPDF,
  };
};
