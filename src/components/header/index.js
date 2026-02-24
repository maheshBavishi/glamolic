"use client";
import React, { useEffect, useState } from "react";
import styles from './header.module.scss';
import classNames from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';

const Logo = '/assets/logo/logo.svg';

function useScrollDirection() {
    const [scrollDirection, setScrollDirection] = useState("noScroll");

    useEffect(() => {
        let lastScrollY = window.pageYOffset;
        const updateScrollDirection = () => {
            const currentScrollTop =
                window.pageYOffset || document.documentElement.scrollTop;
            const scrollY = window.pageYOffset;
            const direction = scrollY > lastScrollY ? "topToDown" : "downToTop";
            if (currentScrollTop === 0) {
                setScrollDirection("noScroll");
            } else if (
                direction !== scrollDirection &&
                (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)
            ) {
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
            delayChildren: 0.2
        }
    },
    closed: {
        x: "100%",
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 40,
            staggerChildren: 0.05,
            staggerDirection: -1
        }
    }
};

const itemVariants = {
    open: {
        y: 0,
        opacity: 1,
        transition: {
            y: { stiffness: 1000, velocity: -100 }
        }
    },
    closed: {
        y: 20,
        opacity: 0,
        transition: {
            y: { stiffness: 1000 }
        }
    }
};

export default function Header() {
    const scrollDirection = useScrollDirection();
    const [headerOpen, setHeaderOpen] = useState(false);

    return (
        <>
            <header className={classNames(
                styles.header,
                scrollDirection === "downToTop"
                    ? styles.show
                    : scrollDirection === "noScroll"
                        ? null
                        : styles.hide
            )}>
                <div className='container'>
                    <div className={styles.headerAlignment}>
                        <div className={styles.logo}>
                            <img src={Logo} alt='Logo' />
                        </div>
                        <div className={styles.menu}>
                            <a aria-label='Home' className={styles.active}>Home</a>
                            <a aria-label='How It Work' href="#howitwork">How It Work</a>
                            <a aria-label='Pricing' href="#pricing">Pricing</a>
                            <a aria-label='History'>History</a>
                            <a aria-label='Contact US'>Contact Us</a>
                        </div>
                        <div className={styles.buttonAlignment}>
                            <button aria-label='Login' className={styles.light}>
                                Login
                            </button>
                            <button aria-label='Login' className={styles.fill}>
                                Get Started
                            </button>
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
                    <motion.div
                        className={styles.mobileHeader}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                    >
                        <div className={styles.mobileHeaderAlign} onClick={() => setHeaderOpen(false)}>
                            <div className={styles.logo}>
                                <img src={Logo} alt='Logo' />
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" />
                            </svg>
                        </div>
                        <div className={styles.mobileBody} onClick={() => setHeaderOpen(false)}>
                            <motion.a variants={itemVariants} aria-label='Home' className={styles.active}>Home</motion.a>
                            <motion.a variants={itemVariants} aria-label='How It Work'>How It Work</motion.a>
                            <motion.a variants={itemVariants} aria-label='Pricing'>Pricing</motion.a>
                            <motion.a variants={itemVariants} aria-label='History'>History</motion.a>
                            <motion.a variants={itemVariants} aria-label='Contact US'>Contact Us</motion.a>
                        </div>
                        <motion.div variants={itemVariants} className={styles.mobileFooter} onClick={() => setHeaderOpen(false)}>
                            <button aria-label='Login' className={styles.light}>
                                Login
                            </button>
                            <button aria-label='Login' className={styles.fill}>
                                Get Started
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}