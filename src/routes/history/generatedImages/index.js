"use client";
import React from "react";
import styles from "./generatedImages.module.scss";
import Button from "@/components/button";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useCreditsStore } from "@/hooks/useCreditsStore";
import { regenerateImage } from "@/api/regenerateImage";
import { useHistoryActions } from "@/hooks/useHistoryActions";

const StickIcon = "/assets/icons/stick.svg";
const PdfIcon = "/assets/icons/pdf.svg";
const DownloadIcon = "/assets/icons/download.svg";
const ReloadIcon = "/assets/icons/reload.svg";
const FillIcon = "/assets/icons/dwonload-fill.svg";
const VideoIcon = "/assets/icons/video.svg";
const DangerIcon = "/assets/icons/danger.svg";

export default function GeneratedImages({ item }) {
  const { user } = useAuth();
  const { credits, fetchCredits } = useCreditsStore();
  const images = item?.thumbnails || [];
  const { handleDownloadImage, handleDownloadAll, handleExportPDF } = useHistoryActions();

  const handleRegenerateImage = async (item, imageUrl, targetIndex) => {
    try {
      if (!credits || credits.available_credits < 1) {
        toast.error("Insufficient credits. Please purchase more credits to regenerate images.");
        return;
      }
      const imagesPerProduct = item.settings?.imagesPerProduct || 1;
      const productIndex = Math.floor(targetIndex / imagesPerProduct);
      const imageIndexInProduct = targetIndex % imagesPerProduct;

      const productMetadata = Array.isArray(item.product_metadata)
        ? item.product_metadata[productIndex] || item.product_metadata[0]
        : item.product_metadata || {};

      let additionalInstructions = [];
      let specificInstruction = "";

      if (productMetadata?.additionalInstructions && Array.isArray(productMetadata.additionalInstructions)) {
        additionalInstructions = productMetadata.additionalInstructions;
        const allInstructions = [];
        if (item.product_metadata && Array.isArray(item.product_metadata)) {
          item.product_metadata.forEach((product) => {
            if (product.additionalInstructions && Array.isArray(product.additionalInstructions)) {
              allInstructions.push(...product.additionalInstructions);
            }
          });
        }
        specificInstruction = allInstructions[targetIndex] || "";
      } else if (item.settings?.additionalInstructions && Array.isArray(item.settings.additionalInstructions)) {
        additionalInstructions = item.settings.additionalInstructions;
        specificInstruction = item.settings.additionalInstructions[targetIndex] || "";
      }

      const payload = {
        product: {
          gender: productMetadata?.gender || "Women",
          itemType: productMetadata?.itemType || "",
          subCategory: productMetadata?.subCategory || "",
          frontPreview: productMetadata?.frontPreview || "",
          backPreview: productMetadata?.backPreview || "",
          referenceImage: productMetadata?.referenceImage || productMetadata?.frontPreview || "",
          blouseImage: productMetadata?.blouseImage || "",
          topImage: productMetadata?.topImage || "",
          bottomImage: productMetadata?.bottomImage || "",
          dupattaImage: productMetadata?.dupattaImage || "",
        },
        settings: {
          productName: item.settings?.productName || "",
          resolution: item.settings?.resolution || "4K",
          imageSize: item.settings?.imageSize || "12x18",
          backgroundType: item.settings?.backgroundType || "Professional Studio",
          unifiedBackground: item.settings?.sameBackground || false,
          modelConsistency: item.settings?.modelConsistency || false,
          additionalInstructions: additionalInstructions,
          numberOfImages: item.settings?.imagesPerProduct || 1,
          aspectRatio: "2:3",
          startingVariationIdx: item.settings?.startingVariationIdx || 0,
        },
        imageUrl: imageUrl,
        targetIndex: imageIndexInProduct,
        additionalInstruction: specificInstruction,
      };

      const toastId = toast.loading("Regenerating image...");

      const response = await regenerateImage(payload);

      if (response?.groupedResults && response.groupedResults.length > 0) {
        const groupedResult = response.groupedResults[0];

        if (!groupedResult?.images || groupedResult.images.length === 0) {
          toast.dismiss(toastId);
          toast.error("Failed to regenerate image");
          return;
        }
        await fetchCredits(user?.id || "");
        toast.dismiss(toastId);
        toast.success("Image regenerated successfully!");
      } else {
        toast.dismiss(toastId);
        toast.error("Failed to regenerate image");
      }
    } catch (error) {
      console.error("Error regenerating image:", error);
      toast.dismiss();
      toast.error(error?.message || "Failed to regenerate image. Please try again.");
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <div className={styles.generatedImages}>
      <div className={styles.subboxHeaderAlignment}>
        <div className={styles.iconText}>
          <img src={StickIcon} alt="StickIcon" />
          <h3>Generated Images</h3>
        </div>
        <div className={styles.twoButtonAlignment}>
          <div onClick={() => handleExportPDF(item)}>
            <Button text="Export PDF" icon={PdfIcon} />
          </div>
          <div onClick={() => handleDownloadAll(item)}>
            <Button text="Download all" icon={DownloadIcon} />
          </div>
        </div>
      </div>
      <div className={styles.imageGrid}>
        {images.map((url, index) => (
          <div key={index} className={styles.items}>
            <div className={styles.image}>
              <img src={url} alt={`Generated ${index}`} />
            </div>
            <div className={styles.topAlignment}>
              <img
                src={ReloadIcon}
                alt="ReloadIcon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRegenerateImage(item, url, index);
                }}
                style={{ cursor: "pointer" }}
              />
              <img
                src={FillIcon}
                alt="FillIcon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadImage(url, index);
                }}
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className={styles.centerAlignment}>
              <div onClick={() => toast("Video generation coming soon!")}>
                <Button text="Generate video" icon={VideoIcon} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.noteAlignment}>
        <div className={styles.note}>
          <img src={DangerIcon} alt="DangerIcon" />
          <p>
            <span>Note: </span> Generated images will be automatically deleted from history after 3 day.
          </p>
        </div>
      </div>
    </div>
  );
}