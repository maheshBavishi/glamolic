import SearchIcon from "@/icons/searchIcon";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./blogBanner.module.scss";
export default function BlogBanner({ currentPage, setCurrentPage, searchValue, setSearchValue, selectedCategory, setSelectedCategory, Categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramsData = searchParams.get("category");

  const handleOnChange = (e) => {
    const { value } = e.target;
    setSearchValue(value?.trimStart());
    const url = `/blog?page=1${value?.trimStart() ? `&search=${value?.trimStart()}` : ""}`;
    router.push(url);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    const url = `/blog?page=${currentPage}${searchValue ? `&search=${searchValue}` : ""}`;
    router.push(url);
    setCurrentPage(1);
  };

  const handleOnCategory = (data) => {
    setSelectedCategory(data?.slug);
    if (paramsData === data?.slug) {
      setSelectedCategory("");
      router.push(`/blog?page=${currentPage}`);
      setCurrentPage(1);
    } else {
      router.push(`/blog?page=1${data?.slug ? `&category=${data?.slug}` : ""}`);
      setCurrentPage(1);
    }
  };

  const handleOnScrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    let url = `/blog?page=${currentPage}`;
    if (searchValue) {
      url += `&search=${searchValue}`;
    }
    if (selectedCategory) {
      url += `&category=${selectedCategory}`;
    }
    router.push(url);
    handleOnScrollToTop();
  }, [currentPage, searchValue, selectedCategory]);

  return (
    <div className={styles.blogBanner}>
      <div className={styles.topAlignment}>
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.griditems}>
              <div className={styles.textstyle}>
                <h1>Transforming Your Content into a Superpower</h1>
                <p>Stay updated on AI detection, humanize AI content, and plagiarism checking with insights from glamolic.com experts.</p>
                <div className={styles.inputsearch}>
                  <input type="search" placeholder="Search" onChange={handleOnChange} value={searchValue} />
                  <div className={styles.icon} onClick={handleSearch}>
                    <SearchIcon />
                  </div>
                </div>
                <div className={styles.buttonAlignment}>
                  {Categories?.map((data, index) => {
                    return (
                      <button key={index} onClick={() => handleOnCategory(data?.attributes)} className={selectedCategory === data?.attributes?.slug ? styles.active : ""}>
                        {data?.attributes?.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className={styles.griditems}>
              <div className={styles.image}>
                <img src="https://aichecker.pro/assets/images/blog-img.png" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
