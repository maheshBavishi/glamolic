"use client";import React, { useState } from "react";
import styles from "../../history.module.scss";
import ProductIcon from "@/icons/productIcon";
import ImageIcon from "@/icons/imageIcon";
import ResolutionIcon from "@/icons/resolutionIcon";
import SizeIcon from "@/icons/sizeIcon";
import StudioIcon from "@/icons/studioIcon";
import NoteIcon from "@/icons/noteIcon";
import CalendarIcon from "@/icons/calendarIcon";
import GeneratedImages from "../../generatedImages";
import { getStatusBadgeClass, getStatusIcon } from "@/utils/statusUtils";

export default function HistoryCard({ item, isExpanded, onToggleExpand }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  let settings = {};
  if (typeof item?.settings === "string") {
    try {
      settings = JSON.parse(item.settings);
    } catch (e) {
      console.error("Failed to parse settings", e);
    }
  } else if (item?.settings && typeof item.settings === "object") {
    settings = item.settings;
  }

  const ProductImage = item?.thumbnails[0];
  const statusText = item?.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Processing";

  const promptInstructions = item?.prompts?.length > 0 ? item.prompts[0].prompt : "No specific instructions provided.";

  return (
    <div className={styles.detailsBox}>
      <div className={styles.detailsboxHeader} onClick={onToggleExpand}>
        <div className={styles.image}>
          {!imgLoaded && <div className={styles.imgSkeleton} />}
          <img
            src={ProductImage}
            alt={item?.productName || "ProductImage"}
            onLoad={() => setImgLoaded(true)}
            style={{ display: imgLoaded ? "block" : "none" }}
          />
        </div>
        <div className={styles.details}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", marginBottom: "8px" }}>
            <div className={styles.primaryChip}>
              <span>{item?.category}</span>
            </div>
            <div className={getStatusBadgeClass(item?.status, styles)}>
              <span>
                {getStatusIcon(item?.status)}
                {statusText}
              </span>

              {/* <span>✓ {statusText}</span> */}
            </div>
            <div style={{ color: "#727272", fontSize: "15px", fontWeight: "500", display: "flex", alignItems: "center", gap: "6px" }}>
              <CalendarIcon />
              {item?.date}
            </div>
          </div>
          <h2 style={{ marginTop: "0" }}>{item?.productName}</h2>
          <div className={styles.allToogleAlignment}>
            <button>
              <ProductIcon />
              {item?.products} Products
            </button>
            <button>
              <ImageIcon />
              {item?.totalImages} Images
            </button>
            <button>
              <ResolutionIcon />
              {settings?.resolution}
            </button>
            <button>
              <SizeIcon />
              {settings?.imageSize}
            </button>
            <button>
              <StudioIcon />
              {settings?.backgroundType}
            </button>
            <button>
              <ProductIcon />
              {settings?.imagesPerProduct} per product
            </button>
          </div>
        </div>
        <div className={`${styles.toggleIcon} ${isExpanded ? styles.toggleIconOpen : ""}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </div>
      </div>
      {isExpanded && (
        <div className={styles.expandedContent}>
          {promptInstructions && (
            <div className={styles.additionalInstructions}>
              <div className={styles.icontext}>
                <NoteIcon />
                <h3>Additional Instructions</h3>
              </div>
              <div className={styles.subtitle}>
                <h4>{item?.productName || "Product 1 (Saree Catalogue)"}</h4>
              </div>
              <div className={styles.typebox}>
                <p>Image1:</p>
                <span>{promptInstructions}</span>
              </div>
            </div>
          )}
          <GeneratedImages item={item} />
        </div>
      )}
    </div>
  );
}
