'use client'
import React, { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import styles from './footer.module.scss';
const FooterLogo = '/assets/logo/footer-logo.svg';
const LikdinIcon = '/assets/icons/linkdin.svg';
const InstagramIcon = '/assets/icons/instagram.svg';
const TwitterIcon = '/assets/icons/twitter.svg';
const YoutubeIcon = '/assets/icons/youtube.svg';
const TextImage = '/assets/icons/text.svg';

function SocialIcon3D({ src, alt }) {
    const ref = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    const x = useMotionValue(0.5);
    const y = useMotionValue(0.5);

    const rotateX = useSpring(useTransform(y, [0, 1], [15, -15]), { stiffness: 300, damping: 20 });
    const rotateY = useSpring(useTransform(x, [0, 1], [-15, 15]), { stiffness: 300, damping: 20 });

    const handleMouseMove = (e) => {
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
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
                perspective: 400,
            }}
            animate={{
                scale: isHovered ? 1.25 : 1,
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className={styles.socialIconItem}
        >
            <img src={src} alt={alt} style={{ transform: 'translateZ(10px)' }} />
        </motion.div>
    );
}

export default function Footer() {
    const socialIcons = [
        { src: LikdinIcon, alt: 'LikdinIcon' },
        { src: InstagramIcon, alt: 'InstagramIcon' },
        { src: TwitterIcon, alt: 'TwitterIcon' },
        { src: YoutubeIcon, alt: 'YoutubeIcon' },
    ];

    return (
        <footer className={styles.footer}>
            <div className='container-md'>
                <div className={styles.footerGrid}>
                    <div className={styles.items}>
                        <div className={styles.leftContentAlignment}>
                            <div className={styles.footerlogo}>
                                <img src={FooterLogo} alt='FooterLogo' />
                            </div>
                            <p>
                                Transform your clothing photos into professional fashion model images using cutting-edge AI technology. Perfect for e-commerce,
                                catalogs, and marketing.
                            </p>
                            <div className={styles.socialIcon}>
                                {socialIcons.map((icon, index) => (
                                    <SocialIcon3D key={index} src={icon.src} alt={icon.alt} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={styles.items}>
                        <div className={styles.menuListAlignment}>
                            <div>
                                <h3>
                                    Product
                                </h3>
                                <div>
                                    <a aria-label='Features'>Features</a>
                                </div>
                                <div>
                                    <a aria-label='Pricing'>Pricing</a>
                                </div>
                                <div>
                                    <a aria-label='How it works'>How it works</a>
                                </div>
                            </div>
                            <div>
                                <h3>
                                    Company
                                </h3>
                                <div>
                                    <a aria-label='About Us'>About Us</a>
                                </div>
                                <a aria-label='Contact'>Contact</a>
                            </div>
                            <div>
                                <h3>
                                    Legal
                                </h3>
                                <div>
                                    <a aria-label='Privacy Policy'>Privacy Policy</a>
                                </div>
                                <a aria-label='Terms of Service'>Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.textImage}>
                <img src={TextImage} alt='TextImage' />
            </div>
        </footer>
    )
}
