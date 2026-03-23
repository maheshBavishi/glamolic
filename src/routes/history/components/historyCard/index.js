"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
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

const hasText = (value) => typeof value === "string" && value.trim().length > 0;

const normalizeProductMetadata = (value) => {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && typeof parsed === "object") return [parsed];
      return [];
    } catch {
      return [];
    }
  }

  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") return [value];
  return [];
};

const ExpandableInstruction = ({ instruction }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (!textRef.current || isExpanded) return;
      setIsOverflowing(textRef.current.scrollHeight > textRef.current.clientHeight);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [instruction, isExpanded]);

  return (
    <div>
      <p ref={textRef} className={`${styles.instructionText} ${!isExpanded ? styles.instructionTextCollapsed : ""}`}>
        {instruction}
      </p>
      {(isOverflowing || isExpanded) && (
        <button className={styles.instructionToggle} onClick={() => setIsExpanded((prev) => !prev)} type="button">
          {isExpanded ? "View Less" : "View More"}
        </button>
      )}
    </div>
  );
};

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

  const productImage = typeof item?.thumbnails?.[0] === "string" ? item.thumbnails[0].trim() : "";
  const normalizedStatus = String(item?.status || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  const isTerminalStatus = ["completed", "failed", "canceled", "cancelled"].includes(normalizedStatus);
  const showImageSkeleton = (!imgLoaded && Boolean(productImage)) || (!productImage && !isTerminalStatus);
  const statusText = item?.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Processing";
  const productMetadata = normalizeProductMetadata(item?.product_metadata);

  const instructionGroups = (() => {
    const groupsFromProducts = productMetadata
      .map((product, productIndex) => {
        const productInstructions = Array.isArray(product?.additionalInstructions)
          ? product.additionalInstructions.filter(hasText)
          : [];

        if (productInstructions.length === 0) return null;

        const productType = [product?.itemType, product?.subCategory].filter(hasText).join(" - ");

        return {
          productIndex,
          title: `Product ${productIndex + 1}`,
          subtitle: productType || item?.productName || "",
          instructions: productInstructions,
        };
      })
      .filter(Boolean);

    if (groupsFromProducts.length > 0) {
      return groupsFromProducts;
    }

    const settingsInstructions = Array.isArray(settings?.additionalInstructions)
      ? settings.additionalInstructions.filter(hasText)
      : [];

    if (settingsInstructions.length > 0) {
      return [
        {
          productIndex: 0,
          title: "Product 1",
          subtitle: item?.productName || "",
          instructions: settingsInstructions,
        },
      ];
    }

    if (hasText(item?.description) && item.description !== "No additional instructions provided.") {
      const descriptionInstructions = item.description
        .split("\n")
        .map((line) => line.replace(/^Image\s*\d+\s*:\s*/i, "").trim())
        .filter(hasText);

      if (descriptionInstructions.length > 0) {
        return [
          {
            productIndex: 0,
            title: "Product 1",
            subtitle: item?.productName || "",
            instructions: descriptionInstructions,
          },
        ];
      }
    }

    const promptInstructions = Array.isArray(item?.prompts) ? item.prompts.map((p) => p?.prompt).filter(hasText) : [];
    if (promptInstructions.length > 0) {
      return [
        {
          productIndex: 0,
          title: "Product 1",
          subtitle: item?.productName || "",
          instructions: promptInstructions,
        },
      ];
    }

    if (hasText(item?.prompt)) {
      return [
        {
          productIndex: 0,
          title: "Product 1",
          subtitle: item?.productName || "",
          instructions: [item.prompt.trim()],
        },
      ];
    }

    return [];
  })();

  useEffect(() => {
    setImgLoaded(false);
  }, [productImage]);

  return (
    <div className={styles.detailsBox}>
      <div className={styles.detailsboxHeader} onClick={onToggleExpand}>
        <div className={styles.image}>
          {showImageSkeleton && <div className={styles.imgSkeleton} />}
          {productImage ? (
            <Image
              src={productImage}
              alt={item?.productName || "Product image"}
              fill
              sizes="166px"
              onLoad={() => setImgLoaded(true)}
              style={{
                objectFit: "cover",
                objectPosition: "top",
                borderRadius: "16px",
                opacity: imgLoaded ? 1 : 0,
                transition: "opacity 0.2s ease-in-out",
              }}
            />
          ) : null}
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
          <div className={styles.additionalInstructions}>
            <div className={styles.icontext}>
              <NoteIcon />
              <h3>Additional Instructions</h3>
            </div>
            {instructionGroups.length > 0 ? (
              <div className={styles.instructionsList}>
                {instructionGroups.map((group) => (
                  <div key={`instruction-group-${group.productIndex}`} className={styles.productInstructionBlock}>
                    <div className={styles.subtitle}>
                      <h4>
                        <span className={styles.productLabel}>{group.title}</span>
                        {group.subtitle ? ` (${group.subtitle})` : ""}
                      </h4>
                    </div>
                    <div className={styles.instructionGrid}>
                      {group.instructions.map((instruction, index) => (
                        <div key={`instruction-${group.productIndex}-${index}`} className={styles.typebox}>
                          <p>Image {index + 1}:</p>
                          <ExpandableInstruction instruction={instruction} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.typebox}>
                <span className={styles.instructionText}>No additional instructions provided for this product.</span>
              </div>
            )}
          </div>
          <GeneratedImages item={item} />
        </div>
      )}
    </div>
  );
}
