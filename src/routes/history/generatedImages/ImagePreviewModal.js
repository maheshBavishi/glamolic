"use client";

import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import styles from "./generatedImages.module.scss";

const MODAL_PRELOAD_OFFSET = [-1, 1];
const ZOOM_SCALE = 2.5;

const clampIndex = (value, min, max) => {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
};

const ImagePreviewModal = ({
  isOpen,
  images,
  currentIndex,
  onClose,
  onIndexChange,
  productName,
}) => {
  const [loadedByIndex, setLoadedByIndex] = useState({});
  const [failedByIndex, setFailedByIndex] = useState({});
  const [isZoomed, setIsZoomed] = useState(false);
  const [targetSize, setTargetSize] = useState(null);
  const viewerBodyRef = useRef(null);

  const totalImages = images.length;
  const safeIndex = clampIndex(currentIndex, 0, Math.max(totalImages - 1, 0));
  const currentImage = images[safeIndex] || "";
  const isLoaded = Boolean(loadedByIndex[safeIndex]);
  const hasFailed = Boolean(failedByIndex[safeIndex]);
  const canGoPrevious = safeIndex > 0;
  const canGoNext = safeIndex < totalImages - 1;

  const resetZoom = useCallback(() => {
    setIsZoomed(false);
    setTargetSize(null);
    if (viewerBodyRef.current) {
      viewerBodyRef.current.scrollTop = 0;
      viewerBodyRef.current.scrollLeft = 0;
    }
  }, []);

  const goPrevious = useCallback(() => {
    if (!canGoPrevious) return;
    onIndexChange(safeIndex - 1);
    resetZoom();
  }, [canGoPrevious, onIndexChange, resetZoom, safeIndex]);

  const goNext = useCallback(() => {
    if (!canGoNext) return;
    onIndexChange(safeIndex + 1);
    resetZoom();
  }, [canGoNext, onIndexChange, resetZoom, safeIndex]);

  const handleImageClick = useCallback(
    (event) => {
      if (!currentImage || hasFailed) return;

      if (isZoomed) {
        resetZoom();
        return;
      }

      const rect = event.currentTarget.getBoundingClientRect();
      const currentWidth = rect.width;
      const currentHeight = rect.height;
      const targetWidth = currentWidth * ZOOM_SCALE;
      const targetHeight = currentHeight * ZOOM_SCALE;

      setTargetSize({ w: targetWidth, h: targetHeight });
      setIsZoomed(true);

      const relativeX = (event.clientX - rect.left) / currentWidth;
      const relativeY = (event.clientY - rect.top) / currentHeight;

      window.setTimeout(() => {
        if (!viewerBodyRef.current) return;
        viewerBodyRef.current.scrollTo({
          left: Math.max(0, targetWidth * relativeX - viewerBodyRef.current.clientWidth / 2),
          top: Math.max(0, targetHeight * relativeY - viewerBodyRef.current.clientHeight / 2),
          behavior: "smooth",
        });
      }, 50);
    },
    [currentImage, hasFailed, isZoomed, resetZoom],
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (isZoomed) {
          resetZoom();
        } else {
          onClose();
        }
        return;
      }
      if (event.key === "ArrowLeft") {
        goPrevious();
        return;
      }
      if (event.key === "ArrowRight") {
        goNext();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goNext, goPrevious, isOpen, isZoomed, onClose, resetZoom]);

  useEffect(() => {
    if (!isOpen) return;

    MODAL_PRELOAD_OFFSET.forEach((offset) => {
      const nextIndex = safeIndex + offset;
      const nextUrl = images[nextIndex];
      if (!nextUrl) return;
      const preload = new window.Image();
      preload.src = nextUrl;
    });
  }, [images, isOpen, safeIndex]);

  useEffect(() => {
    if (!isOpen) return;
    resetZoom();
  }, [isOpen, resetZoom, safeIndex]);

  if (!isOpen || totalImages === 0) {
    return null;
  }

  return (
    <div className={styles.viewerBackdrop} onClick={onClose} role="dialog" aria-modal="true" aria-label="Image preview">
      <div className={styles.viewerPanel} onClick={(event) => event.stopPropagation()}>
        <div className={styles.viewerHeader}>
          <p className={styles.viewerTitle}>
            {productName || "AI Photoshoot"} ({safeIndex + 1} of {totalImages})
          </p>
          <button type="button" className={styles.viewerCloseButton} onClick={onClose} aria-label="Close preview">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div
          ref={viewerBodyRef}
          className={`${styles.viewerBody} ${isZoomed ? styles.viewerBodyZoomed : styles.viewerBodyDefault}`}
          data-lenis-prevent
          data-lenis-prevent-wheel
          onWheel={(event) => {
            event.stopPropagation();
          }}
          onTouchMove={(event) => {
            event.stopPropagation();
          }}
        >
          {!isLoaded && !hasFailed && <div className={styles.viewerLoader} aria-hidden="true" />}
          <div
            className={`${styles.viewerImageCanvas} ${isZoomed ? styles.viewerImageCanvasZoomed : styles.viewerImageCanvasDefault}`}
            style={
              isZoomed && targetSize
                ? {
                    width: `${targetSize.w}px`,
                    height: `${targetSize.h}px`,
                    minWidth: `${targetSize.w}px`,
                    minHeight: `${targetSize.h}px`,
                  }
                : undefined
            }
          >
            {currentImage ? (
              <img
                src={currentImage}
                alt={`Generated image ${safeIndex + 1}`}
                draggable={false}
                onClick={handleImageClick}
                className={`${styles.viewerImage} ${isLoaded ? styles.viewerImageLoaded : ""} ${isZoomed ? styles.viewerImageZoomed : ""}`}
                onLoad={() => {
                  setLoadedByIndex((prev) => ({ ...prev, [safeIndex]: true }));
                  setFailedByIndex((prev) => ({ ...prev, [safeIndex]: false }));
                }}
                onError={() => {
                  setFailedByIndex((prev) => ({ ...prev, [safeIndex]: true }));
                  setLoadedByIndex((prev) => ({ ...prev, [safeIndex]: true }));
                }}
              />
            ) : (
              <div className={styles.viewerFallback}>Image not available</div>
            )}
            {hasFailed && <div className={styles.viewerFallback}>Image not available</div>}
          </div>
          {isLoaded && !isZoomed && !hasFailed ? <div className={styles.viewerHint}>Click image to zoom - scroll to pan</div> : null}
        </div>

        {totalImages > 1 ? (
          <>
            <button
              type="button"
              className={`${styles.viewerNavButton} ${styles.viewerNavLeft}`}
              onClick={goPrevious}
              disabled={!canGoPrevious}
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              className={`${styles.viewerNavButton} ${styles.viewerNavRight}`}
              onClick={goNext}
              disabled={!canGoNext}
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default memo(ImagePreviewModal);
