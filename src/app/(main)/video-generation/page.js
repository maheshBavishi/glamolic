import VideoGeneration from "@/routes/videoGeneration";
import React from "react";

export default async function page({ searchParams }) {
  const params = (await searchParams) || {};
  const imageUrl = typeof params?.imageUrl === "string" ? params.imageUrl : "";
  const productName = typeof params?.productName === "string" ? params.productName : "";

  return (
    <div>
      <VideoGeneration imageUrl={imageUrl} productName={productName} />
    </div>
  );
}
