"use client";
import React, { useState } from "react";
import styles from "./blog.module.scss";
import BlogBanner from "./blogBanner";
import BlogCardview from "./blogCardview";
export default function Blog({ Blogs, paginationData, Categories }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  return (
    <div>
      <BlogBanner
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        Categories={Categories}
      />
      <BlogCardview Blogs={Blogs} paginationData={paginationData} />
    </div>
  );
}
