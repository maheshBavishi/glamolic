"use client";
import { useAuth } from "@/context/AuthContext";
import { useCreditsStore } from "@/hooks/useCreditsStore";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./header.module.scss";

const Logo = "/assets/logo/logo.svg";

// Icons specifically added from standard SVG paths (no lucide-react used)
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HistoryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState("noScroll");

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    const updateScrollDirection = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? "topToDown" : "downToTop";
      if (currentScrollTop === 0) {
        setScrollDirection("noScroll");
      } else if (direction !== scrollDirection && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)) {
        setScrollDirection(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };
    window.addEventListener("scroll", updateScrollDirection);
    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, [scrollDirection]);

  return scrollDirection;
}

const menuVariants = {
  open: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  closed: {
    x: "100%",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 20,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

export default function Header() {
  const scrollDirection = useScrollDirection();
  const [headerOpen, setHeaderOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { user, profile, signOut, loading } = useAuth();
  const { credits, fetchCredits, loading: creditsLoading } = useCreditsStore();
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user?.id) {
      fetchCredits(user.id);
    }
  }, [user, fetchCredits]);

  useOnClickOutside(dropdownRef, () => setDropdownOpen(false));

  const handleSignOut = async () => {
    await signOut();
    setDropdownOpen(false);
    setHeaderOpen(false);
  };

  return (
    <>
      <header
        className={classNames(styles.header, scrollDirection === "downToTop" ? styles.show : scrollDirection === "noScroll" ? null : styles.hide)}
      >
        <div className="container">
          <div className={styles.headerAlignment}>
            <div className={styles.logo}>
              <Link href="/">
                <img src={Logo} alt="Logo" />
              </Link>
            </div>
            <div className={styles.menu}>
              <a aria-label="Home" className={styles.active}>
                Home
              </a>
              <a aria-label="How It Work" href="#howitwork">
                How It Work
              </a>
              <a aria-label="Pricing" href="#pricing">
                Pricing
              </a>
              <Link href="/history" aria-label="History">
                History
              </Link>
              <Link href="/contact-us" aria-label="Contact US">
                Contact Us
              </Link>
            </div>
            <div className={styles.buttonAlignment}>
              {loading ? (
                <div style={{ width: "180px", height: "40px" }} />
              ) : user ? (
                <>
                  {profile && (
                    <div className={styles.creditsBadge}>
                      <span className={styles.label}>Credits:</span>
                      <span className={styles.value}>{creditsLoading ? "..." : (credits?.available_credits ?? profile?.tokens ?? 0)}</span>
                    </div>
                  )}

                  <div className={styles.userDropdownContainer} ref={dropdownRef}>
                    <div className={styles.userAvatarBtn} onClick={() => setDropdownOpen(!dropdownOpen)}>
                      <span>{profile?.name?.charAt(0) || user?.email?.charAt(0) || "U"}</span>
                    </div>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          className={styles.dropdownMenu}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className={styles.userInfo}>
                            {profile?.name && <div className={styles.name}>{profile.name}</div>}
                            <div className={styles.email}>{user.email}</div>
                          </div>

                          <Link href="/profile" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                            <UserIcon /> Profile
                          </Link>

                          <Link href="/history" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                            <HistoryIcon /> History
                          </Link>

                          <button className={classNames(styles.dropdownItem, styles.separator)} onClick={handleSignOut}>
                            <LogoutIcon /> Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <button aria-label="Login" className={styles.light}>
                      Login
                    </button>
                  </Link>
                  <Link href="/signup">
                    <button aria-label="Get Started" className={styles.fill}>
                      Get Started
                    </button>
                  </Link>
                </>
              )}

              <div className={styles.mobileMenu} onClick={() => setHeaderOpen(!headerOpen)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                  <path d="M64 160C64 142.3 78.3 128 96 128L480 128C497.7 128 512 142.3 512 160C512 177.7 497.7 192 480 192L96 192C78.3 192 64 177.7 64 160zM128 320C128 302.3 142.3 288 160 288L544 288C561.7 288 576 302.3 576 320C576 337.7 561.7 352 544 352L160 352C142.3 352 128 337.7 128 320zM512 480C512 497.7 497.7 512 480 512L96 512C78.3 512 64 497.7 64 480C64 462.3 78.3 448 96 448L480 448C497.7 448 512 462.3 512 480z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {headerOpen && (
          <motion.div className={styles.mobileHeader} initial="closed" animate="open" exit="closed" variants={menuVariants}>
            <div className={styles.mobileHeaderAlign} onClick={() => setHeaderOpen(false)}>
              <div className={styles.logo}>
                <img src={Logo} alt="Logo" />
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" />
              </svg>
            </div>
            <div className={styles.mobileBody} onClick={() => setHeaderOpen(false)}>
              <motion.a variants={itemVariants} aria-label="Home" className={styles.active}>
                Home
              </motion.a>
              <motion.a variants={itemVariants} aria-label="How It Work">
                How It Work
              </motion.a>
              <motion.a variants={itemVariants} aria-label="Pricing">
                Pricing
              </motion.a>
              <motion.a variants={itemVariants} aria-label="History">
                History
              </motion.a>
              <motion.a variants={itemVariants} aria-label="Contact US">
                Contact Us
              </motion.a>
            </div>
            <motion.div variants={itemVariants} className={styles.mobileFooter} onClick={() => setHeaderOpen(false)}>
              {loading ? (
                <div style={{ width: "100%", height: "40px" }} />
              ) : user ? (
                <button aria-label="Sign Out" className={styles.fill} onClick={handleSignOut}>
                  Sign Out
                </button>
              ) : (
                <>
                  <Link href="/login" style={{ width: "100%" }}>
                    <button aria-label="Login" className={styles.light}>
                      Login
                    </button>
                  </Link>
                  <Link href="/signup" style={{ width: "100%" }}>
                    <button aria-label="Get Started" className={styles.fill}>
                      Get Started
                    </button>
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
