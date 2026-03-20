import History from "@/routes/history";
import React from "react";

export default async function page({ searchParams }) {
  const params = (await searchParams) || {};
  const initialTab = params?.tab === "videos" ? "videos" : "images";

  return (
    <div>
      <History initialTab={initialTab} />
    </div>
  );
}
