"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "../../history.module.scss";
import { getStatusBadgeClass, getStatusIcon } from "@/utils/statusUtils";
import CalendarIcon from "@/icons/calendarIcon";
import ClockIcon from "@/icons/clockIcon";
import SizeIcon from "@/icons/sizeIcon";
import VideoIcon from "@/icons/videoIcon";
import NoteIcon from "@/icons/noteIcon";
import AudioIcon from "@/icons/audioIcon";
import toast from "react-hot-toast";

const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const PlayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polygon points="10 8 16 12 10 16 10 8"></polygon>
  </svg>
);

const handleDownloadVideo = async (url, filename) => {
  if (!url) {
    toast.error("Video URL not available");
    return;
  }
  try {
    toast.loading("Starting download...", { id: "downloading" });
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename || "video.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
    toast.success("Download started!", { id: "downloading" });
  } catch (error) {
    console.error("Download failed:", error);
    toast.error("Failed to download video", { id: "downloading" });
  }
};

export default function VideoHistoryCard({ item, isExpanded, onToggleExpand }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {};
  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const getThumbnail = () => {
    if (item.generated_images && item.generated_images.length > 0) {
      const thumbnail = item.generated_images[0];
      return typeof thumbnail === "string" ? thumbnail.trim() : "";
    }
    return typeof item?.settings?.image_link === "string" ? item.settings.image_link.trim() : "";
  };

  const thumbnailUrl = getThumbnail();
  const statusText = item?.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Processing";
  const productName = item?.settings?.product_name || item?.settings?.user_input || "Untitled Video";
  const dateFormatted = new Date(item.created_at).toLocaleString();

  const videoUrl = item?.video_url;

  useEffect(() => {
    setImgLoaded(false);
  }, [thumbnailUrl]);

  return (
    <div className={styles.detailsBox} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className={styles.detailsboxHeader} onClick={() => onToggleExpand(item.id)}>
        <div
          className={styles.image}
          style={{
            position: "relative",
            backgroundColor: "#000",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "16px",
          }}
        >
          {!imgLoaded && thumbnailUrl && <div className={styles.imgSkeleton} />}
          {thumbnailUrl ? (
            <>
              <Image
                src={thumbnailUrl}
                alt={productName}
                fill
                sizes="166px"
                onLoad={() => setImgLoaded(true)}
                style={{
                  objectFit: "cover",
                  opacity: imgLoaded ? 0.8 : 0,
                  transition: "opacity 0.2s ease-in-out",
                }}
              />
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                <PlayIcon />
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", color: "#666" }}>
              <VideoIcon />
              <p style={{ fontSize: "12px", marginTop: "4px" }}>Processing</p>
            </div>
          )}
        </div>
        <div className={styles.details}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", marginBottom: "8px" }}>
            <div className={styles.primaryChip} style={{ backgroundColor: "rgba(168, 85, 247, 0.1)", borderColor: "rgba(168, 85, 247, 0.2)" }}>
              <span style={{ color: "#a855f7" }}>AI Video</span>
            </div>
            <div className={getStatusBadgeClass(item?.status, styles)}>
              <span>
                {getStatusIcon(item?.status)}
                {statusText}
              </span>
            </div>
            <div style={{ color: "#727272", fontSize: "15px", fontWeight: "500", display: "flex", alignItems: "center", gap: "6px" }}>
              <CalendarIcon />
              {dateFormatted}
            </div>
          </div>
          <h2 style={{ marginTop: "0" }}>{productName}</h2>
          <div className={styles.allToogleAlignment}>
            <button style={{ backgroundColor: "#EFF3F3", border: "1px solid #E1E6E6", color: "#2B414B", borderRadius: "20px" }}>
              <ClockIcon stroke="#2B414B" />
              {item?.settings?.video_duration || "10"}s
            </button>
            <button style={{ backgroundColor: "#EFF3F3", border: "1px solid #E1E6E6", color: "#2B414B", borderRadius: "20px" }}>
              <SizeIcon fill="#2B414B" />
              {item?.settings?.aspect_ratio || "Portrait"}
            </button>
            <button
              style={{
                backgroundColor: "#EFF3F3",
                border: "1px solid #E1E6E6",
                color: "#2B414B",
                borderRadius: "20px",
                padding: "4px 14px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <AudioIcon stroke="#2B414B" />
              Audio: {item?.settings?.audio_type || "Instrumental"}
            </button>
          </div>
        </div>
        <div className={`${styles.toggleIcon} ${isExpanded ? styles.toggleIconOpen : ""}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </div>
      </div>
      {isExpanded && (
        <div className={styles.expandedContent}>
          <div className={styles.additionalInstructions}>
            <div className={styles.icontext}>
              <NoteIcon />
              <h3 style={{ margin: 0 }}>Prompt</h3>
            </div>
            <div className={styles.typebox}>
              <span style={{ whiteSpace: "pre-wrap", color: "#666", lineHeight: "1.6" }}>
                {item?.settings?.user_input || item?.prompt || "No prompt available."}
              </span>
            </div>
          </div>
          <div style={{ padding: "0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <VideoIcon />
                <h3 style={{ margin: 0, fontSize: "24px", color: "#3F4153", fontWeight: "600" }}>Generated Video</h3>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadVideo(videoUrl, `${productName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.mp4`);
                }}
                disabled={!videoUrl}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  borderRadius: "100px",
                  border: "1px solid rgba(18, 18, 18, 0.1)",
                  background: "transparent",
                  cursor: videoUrl ? "pointer" : "not-allowed",
                  fontWeight: "500",
                  opacity: videoUrl ? 1 : 0.5,
                }}
              >
                <DownloadIcon />
                Download Video
              </button> 
            </div>
            <div
              style={{
                borderRadius: "24px",
                overflow: "hidden",
                background: "#000",
                width: "100%",
                aspectRatio: "16/9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {videoUrl ? (
                <video src={videoUrl} controls style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              ) : (
                <div style={{ color: "#fff", textAlign: "center" }}>
                   {item?.status === "failed" ? (
                     <>
                       <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                         <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                           <circle cx="12" cy="12" r="10"></circle>
                           <line x1="12" y1="8" x2="12" y2="12"></line>
                           <line x1="12" y1="16" x2="12.01" y2="16"></line>
                         </svg>
                       </div>
                       <p style={{ color: "#f87171", fontSize: "16px", marginBottom: "4px" }}>Generation Failed</p>
                       <p style={{ color: "#fca5a5", fontSize: "12px", maxWidth: "250px", margin: "0 auto" }}>{item?.error_message || "An unknown error occurred"}</p>
                     </>
                   ) : (
                     <>
                       <div style={{ animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite", marginBottom: "8px", display: "flex", justifyContent: "center" }}>
                         <VideoIcon />
                       </div>
                       <p>Video is processing...</p>
                     </>
                   )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
