"use client";

import React, { memo, useCallback, useEffect, useState, useRef } from "react";
import styles from "../../gallery.module.scss";

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const isVideoUrl = (url) => {
  if (!url) return false;
  return url.toLowerCase().includes('.mp4') || url.toLowerCase().includes('.webm');
};

const GalleryPreviewModal = ({
  isOpen,
  images,
  currentIndex,
  onClose,
  onIndexChange,
}) => {
  const [loadedMap, setLoadedMap] = useState({});
  const [failedMap, setFailedMap] = useState({});
  const [magnifierActive, setMagnifierActive] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0.5, y: 0.5 });
  const [cursorPixelPos, setCursorPixelPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const imgRef = useRef(null);

  const totalImages = images.length;
  const safeIndex = clamp(currentIndex, 0, Math.max(totalImages - 1, 0));
  const currentUrl = images[safeIndex] || "";
  const isVideo = isVideoUrl(currentUrl);
  const isLoaded = Boolean(loadedMap[safeIndex]);
  const hasFailed = Boolean(failedMap[safeIndex]);
  const canPrev = safeIndex > 0;
  const canNext = safeIndex < totalImages - 1;

  const goPrev = useCallback(() => {
    if (!canPrev) return;
    onIndexChange(safeIndex - 1);
    setMagnifierActive(false);
  }, [canPrev, onIndexChange, safeIndex]);

  const goNext = useCallback(() => {
    if (!canNext) return;
    onIndexChange(safeIndex + 1);
    setMagnifierActive(false);
  }, [canNext, onIndexChange, safeIndex]);


  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, goPrev, goNext, onClose]);


  const handleMouseMove = (e) => {
    if (!magnifierActive || !imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    const y = clamp((e.clientY - rect.top) / rect.height, 0, 1);
    setCursorPos({ x, y });
    setCursorPixelPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  useEffect(() => {
    setMagnifierActive(false);
  }, [safeIndex]);

  if (!isOpen || totalImages === 0) return null;

  const ZOOM_LEVEL = 2.5;

  return (
    <div className={styles.modalBackdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>

        <div
          className={`${styles.imageWrapper} ${magnifierActive ? styles.magnifierCursor : ''}`}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button className={styles.topRightClose} onClick={onClose} aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {!isLoaded && !hasFailed && (
            <div className={styles.modalLoader}>
              <div className={styles.spinner} />
            </div>
          )}

          {currentUrl && !hasFailed ? (
            isVideo ? (
              <video
                ref={imgRef}
                src={currentUrl}
                className={`${styles.mainImg} ${isLoaded ? styles.imgLoaded : ""}`}
                onLoadedData={() => {
                  setLoadedMap((p) => ({ ...p, [safeIndex]: true }));
                  setFailedMap((p) => ({ ...p, [safeIndex]: false }));
                }}
                onError={() => {
                  setFailedMap((p) => ({ ...p, [safeIndex]: true }));
                  setLoadedMap((p) => ({ ...p, [safeIndex]: true }));
                }}
                controls
                autoPlay
              />
            ) : (
              <>
                <img
                  ref={imgRef}
                  src={currentUrl}
                  alt={`Preview ${safeIndex + 1}`}
                  draggable={false}
                  className={`${styles.mainImg} ${isLoaded ? styles.imgLoaded : ""}`}
                  onLoad={() => {
                    setLoadedMap((p) => ({ ...p, [safeIndex]: true }));
                    setFailedMap((p) => ({ ...p, [safeIndex]: false }));
                  }}
                  onError={() => {
                    setFailedMap((p) => ({ ...p, [safeIndex]: true }));
                    setLoadedMap((p) => ({ ...p, [safeIndex]: true }));
                  }}
                />
  
                {magnifierActive && isHovering && isLoaded && (
                  <div
                    className={styles.lens}
                    style={{
                      left: `${cursorPos.x * 100}%`,
                      top: `${cursorPos.y * 100}%`
                    }}
                  />
                )}
              </>
            )
          ) : (
            <div className={styles.errorText}>Media not available</div>
          )}

          {!isVideo && isLoaded && !hasFailed && (
            <button
              className={`${styles.magnifierBtn} ${magnifierActive ? styles.activeBtn : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setMagnifierActive((prev) => !prev);
              }}
              onMouseMove={(e) => e.stopPropagation()}
              onMouseEnter={(e) => e.stopPropagation()}
              title="Toggle Magnifier"
              aria-label="Toggle Magnifier"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>
          )}
          {totalImages > 1 && (
            <>
              <button
                className={`${styles.navBtn} ${styles.navLeft}`}
                onClick={goPrev}
                disabled={!canPrev}
                aria-label="Previous image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                className={`${styles.navBtn} ${styles.navRight}`}
                onClick={goNext}
                disabled={!canNext}
                aria-label="Next image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}
        </div>

        {magnifierActive && isHovering && isLoaded && (
          <div
            className={styles.magnifierResult}
            style={{
              position: 'fixed',
              transform: 'none',
              left: typeof window !== 'undefined' && cursorPixelPos.x + 520 > window.innerWidth
                ? cursorPixelPos.x - 520
                : cursorPixelPos.x + 20,
              top: typeof window !== 'undefined' && cursorPixelPos.y + 420 > window.innerHeight
                ? cursorPixelPos.y - 420
                : cursorPixelPos.y + 20,
            }}
          >
            <div
              className={styles.magnifierInner}
              style={{
                backgroundImage: `url(${currentUrl})`,
                backgroundSize: `${ZOOM_LEVEL * 100}%`,
                backgroundPosition: `${cursorPos.x * 100}% ${cursorPos.y * 100}%`
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(GalleryPreviewModal);