import Gallery from "@/routes/gallery";
import React from "react";

export const metadata = {
  title: "Lookbook — Glamolic AI Fashion Gallery",
  description:
    "Explore stunning AI-generated fashion photography from Glamolic. Browse our curated lookbook of AI photoshoots — no account required.",
};

export default function GalleryPage() {
  return (
    <div>
      <Gallery />
    </div>
  );
}
