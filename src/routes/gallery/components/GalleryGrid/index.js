"use client";

import React, { memo, useState } from "react";
import styles from "../../gallery.module.scss";
import { useAuth } from "@/context/AuthContext";

const isVideoUrl = (image) => {
  if (image.type) return image.type === 'video';
  if (!image.url) return false;
  return image.url.toLowerCase().includes('.mp4') || image.url.toLowerCase().includes('.webm');
};

const GalleryTile = memo(function GalleryTile({ image, index, onPreview, isAuthenticated }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const isVideo = isVideoUrl(image);

  const handleDownload = async (e) => {
    e.stopPropagation();
    if (!image.url) return;
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      const ext = blob.type.split("/")[1] || (isVideo ? "mp4" : "jpg");
      a.download = `glamolic-${index + 1}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("[GalleryTile] download error:", err);
    }
  };

  return (
    <div
      className={styles.imageTile}
      onClick={() => onPreview(index)}
      role="button"
      tabIndex={0}
      aria-label={`Preview media ${index + 1}`}
      onKeyDown={(e) => e.key === "Enter" && onPreview(index)}
    >
      {!loaded && !failed && <div className={styles.tileSkeleton} />}

      {!failed && (
        isVideo ? (
          <video
            src={image.url}
            className={styles.tileImg}
            style={loaded ? {} : { position: "absolute", opacity: 0, pointerEvents: "none" }}
            onLoadedData={() => setLoaded(true)}
            onError={() => {
              setFailed(true);
              setLoaded(true);
            }}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={image.url}
            alt={image.title || `Gallery image ${index + 1}`}
            className={styles.tileImg}
            loading="lazy"
            style={loaded ? {} : { position: "absolute", opacity: 0, pointerEvents: "none" }}
            onLoad={() => setLoaded(true)}
            onError={() => {
              setFailed(true);
              setLoaded(true);
            }}
          />
        )
      )}

      {loaded && !failed && (
        <div className={styles.tileOverlay}>
          {isAuthenticated && (
            <div className={styles.tileActions}>
              <button
                type="button"
                className={`${styles.tileBtn} ${styles.tileBtnIcon}`}
                onClick={handleDownload}
                aria-label="Download media"
                title="Download"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

const SKELETON_COUNT = Array.from({ length: 8 });

function SkeletonGrid() {
  return (
    <>
      {SKELETON_COUNT.map((_, i) => (
        <div
          key={i}
          className={styles.skeletonTile}
        />
      ))}
    </>
  );
}

function GalleryGrid({ images, loadingGallery, hasMore, onPreview }) {
  const { user } = useAuth();
  if (loadingGallery && images.length === 0) {
    return (
      <div className={styles.masonryGrid}>
        <SkeletonGrid />
      </div>
    );
  }

  return (
    <div className={styles.masonryGrid}>
      {images.map((image, index) => (
        <GalleryTile
          key={image.id}
          image={image}
          index={index}
          onPreview={onPreview}
          isAuthenticated={!!user}
        />
      ))}

      {hasMore && loadingGallery &&
        Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`more-skel-${i}`}
            className={styles.skeletonTile}
          />
        ))}
    </div>
  );
}

export default memo(GalleryGrid);
