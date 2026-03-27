"use client";
import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import styles from "./footer.module.scss";
import Link from "next/link";
const FooterLogo = "/assets/logo/footer-logo.svg";
const InstagramIcon = "/assets/icons/instagram.svg";
const WhatsAppIcon = "/assets/icons/whatsApp.svg";
// const LikdinIcon = "/assets/icons/linkdin.svg";
// const TwitterIcon = "/assets/icons/twitter.svg";
// const YoutubeIcon = "/assets/icons/youtube.svg";
const TextImage = "/assets/icons/text.svg";

function SocialIcon3D({ href, label, children, src, alt }) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [15, -15]), { stiffness: 300, damping: 20 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-15, 15]), { stiffness: 300, damping: 20 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    x.set(px);
    y.set(py);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 400,
      }}
      animate={{
        scale: isHovered ? 1.25 : 1,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={styles.socialIconItem}
    >
      <span style={{ transform: "translateZ(10px)", display: "flex" }}>
        {children || <img src={src} alt={alt} />}
      </span>
    </motion.a>
  );
}

export default function Footer() {
  const socialIcons = [
    {
      href: "https://www.instagram.com/glamolicai/",
      label: "Instagram",
      src: InstagramIcon,
      alt: "Instagram icon",
    },
    {
      href: "https://wa.me/918200058875",
      label: "WhatsApp",
      src: WhatsAppIcon,
      alt: "WhatsApp icon",
    },
    // {
    //   href: "#",
    //   label: "LinkedIn",
    //   src: LikdinIcon,
    //   alt: "LinkedIn icon",
    // },
    // {
    //   href: "#",
    //   label: "Twitter",
    //   src: TwitterIcon,
    //   alt: "Twitter icon",
    // },
    // {
    //   href: "#",
    //   label: "YouTube",
    //   src: YoutubeIcon,
    //   alt: "YouTube icon",
    // },
  ];

  return (
    <footer className={styles.footer}>
      <div className="container-md">
        <div className={styles.footerGrid}>
          <div className={styles.items}>
            <div className={styles.leftContentAlignment}>
              <div className={styles.footerlogo}>
                <img src={FooterLogo} alt="FooterLogo" />
              </div>
              <p>
                Transform your clothing photos into professional fashion model images using cutting-edge AI technology. Perfect for e-commerce,
                catalogs, and marketing.
              </p>
              <div className={styles.socialIcon}>
                {socialIcons.map((icon, index) => (
                  <SocialIcon3D
                    key={index}
                    href={icon.href}
                    label={icon.label}
                    src={icon.src}
                    alt={icon.alt}
                  >
                    {icon.children}
                  </SocialIcon3D>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.items}>
            <div className={styles.menuListAlignment}>
              <div>
                <h3>Product</h3>
                <div>
                  <Link href="/#features" aria-label="Features">
                    Features
                  </Link>
                </div>
                <div>
                  <Link href="/#pricing" aria-label="Pricing">
                    Pricing
                  </Link>
                </div>
                <div>
                  <Link href="/#howitwork" aria-label="How it works">
                    How it works
                  </Link>
                </div>
              </div>
              <div>
                <h3>Company</h3>
                <div>
                  <Link href="/about-us" aria-label="About Us">
                    About Us
                  </Link>
                </div>
                <div>
                  <Link href="/blog" aria-label="Blogs">
                    Blogs
                  </Link>
                </div>
                <div>
                  <Link href="/contact-us" aria-label="Contact">
                    Contact
                  </Link>
                </div>
                <div>
                  <Link href="/sitemap.xml" aria-label="Sitemap">
                    Sitemap
                  </Link>
                </div>
              </div>
              <div>
                <h3>Legal</h3>
                <div>
                  <Link href="/privacy-policy" aria-label="Privacy Policy">
                    Privacy Policy
                  </Link>
                </div>
                <div>
                  <Link href="/cookie-policy" aria-label="Cookie Policy">
                    Cookie Policy
                  </Link>
                </div>
                <Link href="/terms-and-conditions" aria-label="Terms of Service">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.textImage}>
        <img src={TextImage} alt="TextImage" />
      </div>
    </footer>
  );
}
