"use client";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import jsPDF from "jspdf";
import toast from "react-hot-toast";
import { supabase } from "@/integrations/supabase/client";
import { collectImageUrls } from "@/utils/imageUrlUtils";

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

  const handleDownloadAll = async (item) => {
    const zip = new JSZip();
    const toastId = toast.loading("Preparing ZIP file...");
    let successCount = 0;
    let errorCount = 0;

    try {
      const imageUrls = await fetchDownloadImageUrls(item);
      const validImages = imageUrls.filter(Boolean);

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
    handleDownloadAll,
    handleExportPDF,
  };
};
