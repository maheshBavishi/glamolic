'use client'
import React from 'react'
import { motion } from 'framer-motion';
import styles from './partnerLogo.module.scss';

const SoraIcon = '/assets/icons/sora.svg';
const LlelevenlabsIcon = '/assets/icons/llelevenlabs.svg';
const VeoIcon = '/assets/icons/veo.svg';
const KingaiIcon = '/assets/icons/kingai.svg';
const WanIcon = '/assets/icons/wan.svg';
const RunwayIcon = '/assets/icons/runway.svg';

const logos = [
    { src: SoraIcon, alt: 'Sora' },
    { src: LlelevenlabsIcon, alt: 'Elevenlabs' },
    { src: VeoIcon, alt: 'Veo' },
    { src: KingaiIcon, alt: 'Kingai' },
    { src: WanIcon, alt: 'Wan' },
    { src: RunwayIcon, alt: 'Runway' },
    { src: SoraIcon, alt: 'Sora' },
    { src: LlelevenlabsIcon, alt: 'Elevenlabs' },
    { src: VeoIcon, alt: 'Veo' },
    { src: KingaiIcon, alt: 'Kingai' },
    { src: WanIcon, alt: 'Wan' },
    { src: RunwayIcon, alt: 'Runway' },
];

export default function PartnerLogo() {
    return (
        <motion.div
            className={styles.partnerLogo}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
        >
            <div className={styles.logoMarqueeContainer}>
                <motion.div
                    className={styles.logoAlignment}
                    animate={{
                        x: ['0%', '-50%'],
                    }}
                    transition={{
                        duration: 20, // Adjust speed as needed
                        ease: "linear",
                        repeat: Infinity,
                    }}
                >
                    {/* Render the logos twice for seamless looping */}
                    {[...logos, ...logos].map((logo, index) => (
                        <div key={index} className={styles.logoItem}>
                            <img src={logo.src} alt={logo.alt} />
                        </div>
                    ))}
                </motion.div>
            </div>
        </motion.div>
    )
}