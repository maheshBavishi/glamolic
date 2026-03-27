"use client";

import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./cookiePolicy.module.scss";

const COOKIE_NAME = "cookieConsent";
const COOKIE_MAX_AGE_DAYS = 365;

export default function CookiePolicy() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookieConsent = Cookies.get(COOKIE_NAME);
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleCookie = (status) => {
    Cookies.set(COOKIE_NAME, status, {
      expires: COOKIE_MAX_AGE_DAYS,
      path: "/",
      sameSite: "Lax",
    });
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.cookiePolicy} role="dialog" aria-live="polite" aria-label="Cookie consent banner">
      <p className={styles.cookieNotice}>
        We use cookies to enhance your visit. Click &quot;Accept&quot; to consent. Learn more in our{" "}
        <Link href="/cookie-policy">Cookie Policy</Link>
      </p>
      <div className={styles.btnRow}>
        <button type="button" onClick={() => handleCookie("rejected")} className={`${styles.cookieBarBtn} ${styles.reject}`}>
          Reject
        </button>
        <button type="button" onClick={() => handleCookie("accepted")} className={`${styles.cookieBarBtn} ${styles.accept}`}>
          Accept
        </button>
        <button type="button" onClick={() => handleCookie("dismissed")} className={styles.closeBtn} aria-label="Dismiss cookie banner">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
