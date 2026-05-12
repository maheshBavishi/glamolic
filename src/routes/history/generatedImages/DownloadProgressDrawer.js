"use client";
import React, { memo } from "react";
import styles from "./generatedImages.module.scss";

const PHASE_LABELS = {
  idle: "",
  fetching: "Downloading images\u2026",
  zipping: "Compressing ZIP\u2026",
  saving: "Saving file\u2026",
};

/**
 * @param {{ state: import('./index').DownloadState, onCancel: () => void, productName: string }} props
 */
const DownloadProgressDrawer = memo(function DownloadProgressDrawer({ state, onCancel, productName }) {
  const isActive = state.phase !== "idle";

  /* ---- progress bar width ---- */
  let barPercent = 0;
  if (state.phase === "fetching" && state.total > 0) {
    // fetching phase counts for 0-70% of the bar
    barPercent = Math.round((state.fetched / state.total) * 70);
  } else if (state.phase === "zipping") {
    // zipping phase: 70-95%
    barPercent = 70 + Math.round((state.zipPercent / 100) * 25);
  } else if (state.phase === "saving") {
    barPercent = 98;
  }

  const label = PHASE_LABELS[state.phase] || "";
  const fileName = productName
    ? `${productName.replace(/\s+/g, "-").toLowerCase()}.zip`
    : "images.zip";

  return (
    <div
      className={`${styles.downloadDrawer} ${isActive ? styles.downloadDrawerVisible : ""}`}
      role="status"
      aria-live="polite"
      aria-label={isActive ? `${label} ${barPercent}%` : undefined}
    >
      <div className={styles.downloadDrawerInner}>
        {/* Left: icon + info */}
        <div className={styles.downloadDrawerInfo}>
          <div className={styles.downloadDrawerIconWrap}>
            <span className={styles.downloadDrawerIconSpinner} aria-hidden="true" />
            <svg
              className={styles.downloadDrawerIcon}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 16L7 11h3V4h4v7h3L12 16Z"
                fill="currentColor"
              />
              <path
                d="M5 18h14v2H5z"
                fill="currentColor"
              />
            </svg>
          </div>

          <div className={styles.downloadDrawerText}>
            <span className={styles.downloadDrawerPhase}>{label}</span>
            <span className={styles.downloadDrawerFileName}>{fileName}</span>
            {state.phase === "fetching" && state.total > 0 && (
              <span className={styles.downloadDrawerCount}>
                {state.fetched} / {state.total} images
              </span>
            )}
            {state.phase === "zipping" && (
              <span className={styles.downloadDrawerCount}>
                Compressing\u2026 {state.zipPercent}%
              </span>
            )}
            {state.phase === "saving" && (
              <span className={styles.downloadDrawerCount}>
                Almost done\u2026
              </span>
            )}
          </div>
        </div>

        {/* Centre: progress bar */}
        <div className={styles.downloadDrawerBarWrap} aria-hidden="true">
          <div
            className={styles.downloadDrawerBar}
            style={{ width: `${barPercent}%` }}
          />
        </div>

        {/* Right: percent + cancel */}
        <div className={styles.downloadDrawerActions}>
          <span className={styles.downloadDrawerPercent}>{barPercent}%</span>
          {state.phase !== "saving" && (
            <button
              className={styles.downloadDrawerCancel}
              onClick={onCancel}
              aria-label="Cancel download"
              type="button"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default DownloadProgressDrawer;
