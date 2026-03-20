"use client";
import Button from "@/components/button";
import Pagination from "@/components/pagination";
import { useAuth } from "@/context/AuthContext";
import { useHistoryData } from "@/hooks/useHistoryData";
import { useVideoHistoryData } from "@/hooks/useVideoHistoryData";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import HistoryCard from "./components/historyCard";
import VideoHistoryCard from "./components/videoHistoryCard";
import styles from "./history.module.scss";
import Link from "next/link";

const GenrationIcon = "/assets/icons/genration.svg";

export default function History() {
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab") === "videos" ? "videos" : "images";
  const [activeTab, setActiveTab] = useState(() => requestedTab);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [expandedId, setExpandedId] = useState(null);
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    setActiveTab((prev) => (prev === requestedTab ? prev : requestedTab));
    setCurrentPage(1);
    setExpandedId(null);
  }, [requestedTab]);

  const { history, totalCount, loadingHistory } = useHistoryData(user, activeTab === "images" ? currentPage : 1, itemsPerPage);
  const { videoHistory, totalVideoCount, loadingVideoHistory } = useVideoHistoryData(user, activeTab === "videos" ? currentPage : 1, itemsPerPage);

  const currentHistory = activeTab === "images" ? history : videoHistory;
  const currentTotalCount = activeTab === "images" ? totalCount : totalVideoCount;
  const currentLoading = activeTab === "images" ? loadingHistory : loadingVideoHistory;

  const totalPages = Math.ceil(currentTotalCount / itemsPerPage) || 1;

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setCurrentPage(1);
    setExpandedId(null);
  };

  const handlePageChange = (page) => {
    setExpandedId(null);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (e) => {
    setExpandedId(null);
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div>
      <div className={styles.historyPageAlignment}>
        <div className="container-md">
          <div className={styles.boxCenter}>
            <div className={styles.boxHeaderAlignment}>
              <div>
                <h2>Generation History</h2>
                <p>Review and download your past generated collections</p>
              </div>
              <div>
                <Link href="/category-selection">
                  <Button text="New Generation" icon={GenrationIcon} />
                </Link>
              </div>
            </div>
            <div className={styles.centerTabAlignment}>
              <div className={styles.tabdesign}>
                <button className={activeTab === "images" ? styles.active : ""} onClick={() => handleTabChange("images")}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M7.5013 18.3333H12.5013C16.668 18.3333 18.3346 16.6667 18.3346 12.5V7.5C18.3346 3.33333 16.668 1.66667 12.5013 1.66667H7.5013C3.33464 1.66667 1.66797 3.33333 1.66797 7.5V12.5C1.66797 16.6667 3.33464 18.3333 7.5013 18.3333Z"
                      stroke="#121212"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.4987 8.33333C8.41917 8.33333 9.16536 7.58714 9.16536 6.66667C9.16536 5.74619 8.41917 5 7.4987 5C6.57822 5 5.83203 5.74619 5.83203 6.66667C5.83203 7.58714 6.57822 8.33333 7.4987 8.33333Z"
                      stroke="#121212"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2.22656 15.7917L6.3349 13.0334C6.99323 12.5917 7.94323 12.6417 8.53489 13.15L8.80989 13.3917C9.45989 13.95 10.5099 13.95 11.1599 13.3917L14.6266 10.4167C15.2766 9.85838 16.3266 9.85838 16.9766 10.4167L18.3349 11.5834"
                      stroke="#121212"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Images
                </button>
                {profile?.video_generation === true && (
                  <button className={activeTab === "videos" ? styles.active : ""} onClick={() => handleTabChange("videos")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10.443 17.0167H5.1763C2.54297 17.0167 1.66797 15.2667 1.66797 13.5084V6.49173C1.66797 3.8584 2.54297 2.9834 5.1763 2.9834H10.443C13.0763 2.9834 13.9513 3.8584 13.9513 6.49173V13.5084C13.9513 16.1417 13.068 17.0167 10.443 17.0167Z"
                        stroke="#121212"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16.2659 14.2501L13.9492 12.6251V7.36678L16.2659 5.74178C17.3992 4.95011 18.3326 5.43344 18.3326 6.82511V13.1751C18.3326 14.5668 17.3992 15.0501 16.2659 14.2501Z"
                        stroke="#121212"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.58203 9.16667C10.2724 9.16667 10.832 8.60702 10.832 7.91667C10.832 7.22631 10.2724 6.66667 9.58203 6.66667C8.89168 6.66667 8.33203 7.22631 8.33203 7.91667C8.33203 8.60702 8.89168 9.16667 9.58203 9.16667Z"
                        stroke="#121212"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Videos
                  </button>
                )}
              </div>
            </div>
            {currentLoading ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>Loading history...</div>
            ) : currentHistory.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" />
                    <path d="M12 8v4l3 3" />
                  </svg>
                </div>
                <h3>No History Yet</h3>
                <p>Your generation history will appear here once you create your first {activeTab === "images" ? "collection" : "video"}.</p>
              </div>
            ) : (
              <>
                <div className={styles.cardsList}>
                  {currentHistory.map((item) =>
                    activeTab === "images" ? (
                      <HistoryCard key={item.id} item={item} isExpanded={expandedId === item.id} onToggleExpand={() => toggleExpand(item.id)} />
                    ) : (
                      <VideoHistoryCard key={item.id} item={item} isExpanded={expandedId === item.id} onToggleExpand={() => toggleExpand(item.id)} />
                    ),
                  )}
                </div>
                {currentHistory.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalCount={currentTotalCount}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
