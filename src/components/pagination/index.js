"use client";
import styles from "./pagination.module.scss";

export default function Pagination({ currentPage, totalPages, totalCount, itemsPerPage, onPageChange, onItemsPerPageChange }) {
  const renderPaginationInfo = () => {
    const start = (currentPage - 1) * itemsPerPage + 1;
    let end = currentPage * itemsPerPage;
    if (end > totalCount) end = totalCount;
    if (totalCount === 0) return "Showing 0 results";
    return `Showing ${start}-${end} of ${totalCount} results`;
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(
          <button key={i} className={currentPage === i ? styles.activePage : ""} onClick={() => onPageChange(i)}>
            {i}
          </button>,
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push(
          <span key={i} className={styles.ellipsis}>
            ...
          </span>,
        );
      }
    }
    return pages;
  };

  if (totalCount === 0) return null;

  return (
    <div className={styles.paginationWrapper}>
      <div className={styles.pageLimit}>
        <span>Show</span>
        <select value={itemsPerPage} onChange={onItemsPerPageChange}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span>per page</span>
      </div>

      <div className={styles.pageInfo}>{renderPaginationInfo()}</div>

      <div className={styles.pageControls}>
        <button className={styles.navButton} onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
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
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div className={styles.pageNumbers}>{renderPageNumbers()}</div>

        <button className={styles.navButton} onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
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
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}
