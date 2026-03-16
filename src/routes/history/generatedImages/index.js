"use client";
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
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
const INITIAL_VISIBLE_IMAGES = 6;
const IMAGE_BATCH_SIZE = 6;
const IMAGE_LOAD_TIMEOUT_MS = 12000;
const MAX_IMAGE_RETRIES = 2;

const getPublicFallbackUrl = (url) => {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    if (!parsed.pathname.includes("/storage/v1/object/sign/")) {
      return "";
    }

    const publicPath = parsed.pathname.replace("/storage/v1/object/sign/", "/storage/v1/object/public/");
    return `${parsed.origin}${publicPath}`;
  } catch {
    return "";
  }
};

const GeneratedImageTile = memo(function GeneratedImageTile({
  imageUrl,
  sourceUrl,
  index,
  onRegenerate,
  onDownload,
  onGenerateVideo,
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [useUnoptimized, setUseUnoptimized] = useState(false);
  const [activeUrl, setActiveUrl] = useState(imageUrl);
  const publicFallbackUrl = getPublicFallbackUrl(sourceUrl);

  useEffect(() => {
    setIsLoaded(false);
    setHasFailed(false);
    setAttempt(0);
    setUseUnoptimized(false);
    setActiveUrl(imageUrl);
  }, [imageUrl]);

  const tryNextStep = useCallback(() => {
    if (!useUnoptimized) {
      setUseUnoptimized(true);
      setAttempt(0);
      return;
    }

    if (attempt < MAX_IMAGE_RETRIES) {
      setAttempt((prev) => prev + 1);
      return;
    }

    if (publicFallbackUrl && activeUrl !== publicFallbackUrl) {
      setActiveUrl(publicFallbackUrl);
      setAttempt(0);
      setHasFailed(false);
      setIsLoaded(false);
      return;
    }

    setHasFailed(true);
  }, [activeUrl, attempt, publicFallbackUrl, useUnoptimized]);

  useEffect(() => {
    if (!imageUrl || isLoaded || hasFailed) return;

    const timeoutId = window.setTimeout(() => {
      tryNextStep();
    }, IMAGE_LOAD_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [imageUrl, isLoaded, hasFailed, attempt, activeUrl, useUnoptimized, tryNextStep]);

  const prioritizeImage = index < 3;
  const imageSrc = activeUrl || imageUrl;

  const handleImageLoad = () => {
    setIsLoaded(true);
    setHasFailed(false);
  };

  const handleImageError = () => {
    tryNextStep();
  };

  return (
    <div className={styles.items}>
      <div className={styles.image}>
        {!isLoaded && !hasFailed && <div className={styles.imageSkeleton} aria-hidden="true" />}
        {imageUrl ? (
          <Image
            key={`${imageSrc}-${attempt}-${useUnoptimized ? "raw" : "opt"}`}
            src={imageSrc}
            alt={`Generated image ${index + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 360px"
            unoptimized={useUnoptimized}
            quality={60}
            className={styles.generatedImage}
            priority={prioritizeImage}
            loading={prioritizeImage ? undefined : "lazy"}
            fetchPriority={prioritizeImage ? "high" : "auto"}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ opacity: isLoaded ? 1 : 0 }}
          />
        ) : (
          <div className={styles.imageFallback}>Image not available</div>
        )}
        {hasFailed && <div className={styles.imageFallback}>Image not available</div>}
      </div>
      {sourceUrl ? (
        <div className={styles.topAlignment}>
          <img
            src={ReloadIcon}
            alt="Regenerate image"
            className={styles.actionIcon}
            onClick={(e) => {
              e.stopPropagation();
              onRegenerate(sourceUrl, index);
            }}
          />
          <img
            src={FillIcon}
            alt="Download image"
            className={styles.actionIcon}
            onClick={(e) => {
              e.stopPropagation();
              onDownload(sourceUrl, index);
            }}
          />
        </div>
      ) : null}
      <div className={styles.centerAlignment}>
        <div onClick={onGenerateVideo}>
          <Button text="Generate video" icon={VideoIcon} />
        </div>
      </div>
    </div>
  );
});

export default function GeneratedImages({ item }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_IMAGES);
  const loadMoreRef = useRef(null);
  const { user } = useAuth();
  const { credits, fetchCredits } = useCreditsStore();
  const imageItems = useMemo(
    () =>
      (item?.thumbnails || []).map((url) => {
        const originalUrl = typeof url === "string" ? url.trim() : "";
        return {
          originalUrl,
          displayUrl: originalUrl,
        };
      }),
    [item?.thumbnails],
  );
  const imageSignature = imageItems.map((imageItem) => imageItem.originalUrl).join("|");
  const visibleImageItems = imageItems.slice(0, visibleCount);
  const hasMoreImages = visibleCount < imageItems.length;
  const { handleDownloadImage, handleDownloadAll, handleExportPDF } = useHistoryActions();
  const handleGenerateVideoSoon = useCallback(() => {
    toast("Video generation coming soon!");
  }, []);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_IMAGES);
  }, [item?.id, imageSignature]);

  useEffect(() => {
    if (!hasMoreImages) return;
    if (!loadMoreRef.current) return;

    if (typeof window !== "undefined" && !("IntersectionObserver" in window)) {
      setVisibleCount(imageItems.length);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;

        setVisibleCount((prev) => Math.min(prev + IMAGE_BATCH_SIZE, imageItems.length));
      },
      {
        root: null,
        rootMargin: "300px 0px",
        threshold: 0,
      },
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasMoreImages, imageItems.length, visibleCount]);

  const handleRegenerateImage = useCallback(async (imageUrl, targetIndex) => {
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
  }, [credits, fetchCredits, item, user?.id]);

  if (!imageItems || imageItems.length === 0) return null;

  return (
    <div className={styles.generatedImages}>
      <div className={styles.subboxHeaderAlignment}>
        <div className={styles.iconText}>
          <Image src={StickIcon} alt="Stick icon" width={18} height={18} />
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
        {visibleImageItems.map((imageItem, index) => {
          const imageUrl = imageItem.displayUrl;
          const sourceUrl = imageItem.originalUrl || imageItem.displayUrl;

          return (
            <GeneratedImageTile
              key={`${sourceUrl}-${index}`}
              imageUrl={imageUrl}
              sourceUrl={sourceUrl}
              index={index}
              onRegenerate={handleRegenerateImage}
              onDownload={handleDownloadImage}
              onGenerateVideo={handleGenerateVideoSoon}
            />
          );
        })}
      </div>

      {hasMoreImages ? (
        <div ref={loadMoreRef} className={styles.loadMoreTrigger} aria-hidden="true">
          <div className={styles.loadMoreSkeleton} />
        </div>
      ) : null}

      <div className={styles.noteAlignment}>
        <div className={styles.note}>
          <Image src={DangerIcon} alt="Warning icon" width={18} height={18} />
          <p>
            <span>Note: </span> Generated images will be automatically deleted from history after 3 day.
          </p>
        </div>
      </div>
    </div>
  );
}
