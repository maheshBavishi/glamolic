"use client";

import { useGalleryData } from "@/hooks/useGalleryData";
import { useCallback, useEffect, useRef, useState } from "react";
import GalleryGrid from "./components/GalleryGrid";
import GalleryPreviewModal from "./components/GalleryPreviewModal";
import styles from "./gallery.module.scss";

export default function Gallery() {
  const [activeTab, setActiveTab] = useState('image');
  const { images, loadingGallery, hasMore, loadMore } =
    useGalleryData(activeTab);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const imageUrls = images.map((img) => img.url);

  const openPreview = useCallback((index) => {
    setPreviewIndex(index);
    setPreviewOpen(true);
  }, []);

  const closePreview = useCallback(() => {
    setPreviewOpen(false);
  }, []);

  const sentinelRef = useRef(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingGallery) {
          loadMore();
        }
      },
      { rootMargin: "0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadingGallery, loadMore]);

  return (
    <div>
      <div className={styles.galleryPageAlignment}>
        <div className="container-md">
          <div className={styles.pageHeader}>
            <div className={styles.headingGroup}>
              <h2>Our Lookbook</h2>
              <p>Stunning AI-generated fashion imagery from our platform</p>
            </div>
          </div>

          <div className={styles.tabsContainer}>
            <button
              className={`${styles.tab} ${activeTab === 'image' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('image')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              Images
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'video' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('video')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
              Videos
            </button>
          </div>

          {loadingGallery && images.length === 0 ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
            </div>
          ) : images.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <h3>Gallery Coming Soon</h3>
              <p>
                Our curated lookbook is being prepared. Check back soon for
                stunning AI-generated fashion imagery!
              </p>
            </div>
          ) : (
            <div style={{ minHeight: '100vh' }}>
              <GalleryGrid
                images={images}
                loadingGallery={loadingGallery}
                hasMore={hasMore}
                onPreview={openPreview}
              />
            </div>
          )}

          <div ref={sentinelRef} className={styles.sentinel} />

          {hasMore && loadingGallery && images.length > 0 && (
            <div className={styles.loadMoreSpinner}>
              <div className={styles.spinner} />
            </div>
          )}
        </div>
      </div>

      <GalleryPreviewModal
        isOpen={previewOpen}
        images={imageUrls}
        currentIndex={previewIndex}
        onClose={closePreview}
        onIndexChange={setPreviewIndex}
      />
    </div>
  );
}
