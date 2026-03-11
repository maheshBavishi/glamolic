"use client";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import jsPDF from "jspdf";
import toast from "react-hot-toast";

export const useHistoryActions = () => {
  const handleDownloadImage = async (url, id) => {
    try {
      const response = await fetch(url, { method: "HEAD" });
      if (!response?.ok) {
        throw new Error("Image not found");
      }
      saveAs(url, `image-${id}.jpg`);
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Failed to download image. The file may have been deleted.");
    }
  };

  const handleDownloadAll = async (item) => {
    const zip = new JSZip();
    const toastId = toast.loading("Preparing ZIP file...");
    let successCount = 0;
    let errorCount = 0;

    try {
      const validThumbnails = await Promise.all(
        item.thumbnails.map(async (url) => {
          if (!url) return null;
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(url, {
              method: "HEAD",
              signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
              console.warn(`Image not found: ${url}`);
              return null;
            }
            return url;
          } catch (error) {
            console.warn(`Error checking image: ${url}`, error);
            return null;
          }
        })
      );

      const validImages = validThumbnails.filter((url) => url !== null);

      if (validImages.length === 0) {
        toast.dismiss(toastId);
        toast.error("No valid images found to download");
        return;
      }

      toast.loading(`Downloading ${validImages.length} images...`, { id: toastId });

      const imagePromises = validImages.map(async (url, index) => {
        try {
          const response = await fetch(url);
          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
          const blob = await response.blob();
          zip.file(`image-${index + 1}.jpg`, blob);
          successCount++;
          toast.loading(`Downloaded ${successCount} of ${validImages.length} images`, {
            id: toastId,
          });
        } catch (error) {
          console.error(`Error downloading image ${index + 1}:`, error);
          errorCount++;
        }
      });

      await Promise.all(imagePromises);

      if (successCount === 0) {
        toast.dismiss(toastId);
        toast.error("Failed to download any images");
        return;
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(
        content,
        `${(item.productName || "images").replace(/\s+/g, "-").toLowerCase()}.zip`
      );
      toast.dismiss(toastId);

      if (errorCount > 0) {
        toast.error(
          `Downloaded ${successCount} images, failed to download ${errorCount} images`
        );
      } else {
        toast.success(`Successfully downloaded ${successCount} images`);
      }
    } catch (error) {
      console.error("ZIP creation failed:", error);
      toast.dismiss(toastId);
      toast.error("Failed to create ZIP file");
    }
  };

  const handleExportPDF = (item) => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const promises = item.thumbnails.map((url) => {
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
          resolve();
        };
        image.onerror = () => {
          console.error("Failed to load image for PDF:", url);
          resolve();
        };
      });
    });

    Promise.all(promises).then(() => {
      pdf.deletePage(pdf.getNumberOfPages());
      pdf.save(`${item.productName || "catalog"}.pdf`);
    });
  };

  return {
    handleDownloadImage,
    handleDownloadAll,
    handleExportPDF,
  };
};
