'use client'
import React from 'react'
import styles from './herobanner.module.scss';
import GalleryIcon from '@/icons/galleryIcon';
import UploadIcon from '@/icons/uploadIcon';
import MagicIcon from '@/icons/magicIcon';
import DemoIcon from '@/icons/demoIcon';
import RightIcon from '@/icons/rightIcon';
import { motion } from 'framer-motion';

const BlackVec = '/assets/icons/drag.svg';
const DemoProduct = '/assets/images/demo-product.png';
const DemoPhotoshoot = '/assets/images/demo-photoshoot.png';
const Catalog = '/assets/images/Catalog.png';
const Catalog2 = '/assets/images/catalog2.png';

export default function Herobanner() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
            },
        },
    };

    const leftItemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    const rightItemVariants = {
        hidden: { opacity: 0, scale: 0.9, x: 40 },
        visible: {
            opacity: 1,
            scale: 1,
            x: 0,
            transition: {
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.5
            },
        },
    };

    const floatingAnimation = {
        animate: {
            y: [0, -10, 0],
            transition: {
                duration: 4,
                ease: "easeInOut"
            }
        }
    };

    const statVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.div
            className={styles.herobanner}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className={styles.herobannerTopAlignment}>
                <div className='container'>
                    <div className={styles.grid}>
                        <motion.div className={styles.griditems} variants={containerVariants}>
                            <motion.div className={styles.tagline} variants={leftItemVariants}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <img src={BlackVec} alt='BlackVec' />
                                    Glamolic AI Studio
                                </motion.button>
                            </motion.div>
                            <motion.h1 variants={leftItemVariants}>
                                Create Studio-Quality Fashion Photos Without a Photoshoot
                            </motion.h1>
                            <motion.div className={styles.text} variants={leftItemVariants}>
                                <p>
                                    Generate professional AI model images from your clothing in seconds. No models, no camera, no editing just
                                    upload & create.
                                </p>
                            </motion.div>
                            <motion.div className={styles.twoButtonAlignment} variants={leftItemVariants}>
                                <motion.button
                                    whileHover={{ scale: 1.02, backgroundColor: '#425e5f' }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <MagicIcon />
                                    Start Creating Magic
                                </motion.button>
                                <motion.button
                                    className={styles.lightButton}
                                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <DemoIcon />
                                    Watch Demo
                                </motion.button>
                            </motion.div>
                            <motion.div className={styles.lastContentAlignment} variants={leftItemVariants}>
                                <motion.div className={styles.items} variants={statVariants}>
                                    <h3>10K+</h3>
                                    <p>Images Generated</p>
                                </motion.div>
                                <motion.div className={styles.items} variants={statVariants}>
                                    <h3>500+</h3>
                                    <p>Happy Brands</p>
                                </motion.div>
                                <motion.div className={styles.items} variants={statVariants}>
                                    <h3>4K</h3>
                                    <p>Max Resolution</p>
                                </motion.div>
                            </motion.div>
                        </motion.div>

                        <motion.div className={styles.griditems} variants={rightItemVariants}>
                            <div className={styles.rightAlignmentBox}>
                                <motion.div variants={rightItemVariants}>
                                    <motion.div
                                        className={styles.uploadBox}
                                        whileHover={{ y: -5 }}
                                        animate={floatingAnimation.animate}
                                    >
                                        <div className={styles.uploadBoxText}>
                                            <div className={styles.icon}>
                                                <GalleryIcon />
                                            </div>
                                            <span>
                                                Just upload and apply! Explore trending styles and see yourself in a new light.
                                            </span>
                                        </div>
                                        <div className={styles.uploadPicture}>
                                            <div>
                                                <p>Upload a picture or drop an image</p>
                                                <div className={styles.btnCenter}>
                                                    <motion.button
                                                        aria-label='Drop your outfit here'
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <UploadIcon />
                                                        Drop your outfit here
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>

                                <motion.div variants={rightItemVariants}>
                                    <motion.div
                                        className={styles.genrateImage}
                                        whileHover={{ y: -5 }}
                                        animate={{
                                            ...floatingAnimation.animate,
                                            transition: { ...floatingAnimation.animate.transition, delay: 1 }
                                        }}
                                    >
                                        <div className={styles.breadcumbAlignment}>
                                            <span>You upload</span>
                                            <RightIcon />
                                            <span>AI creates</span>
                                        </div>
                                        <div className={styles.twocol}>
                                            <div className={styles.items}>
                                                <motion.div className={styles.imagestyle} whileHover={{ scale: 1.02 }}>
                                                    <img src={DemoProduct} alt='DemoProduct' />
                                                    <div className={styles.bottombutton}>
                                                        <button>Saree.png</button>
                                                    </div>
                                                </motion.div>
                                                <motion.div className={styles.imagestyle} whileHover={{ scale: 1.02 }}>
                                                    <img src={DemoPhotoshoot} alt='DemoPhotoshoot' />
                                                    <div className={styles.bottombutton}>
                                                        <button>AI Generated photoshoot</button>
                                                    </div>
                                                </motion.div>
                                            </div>
                                            <div className={styles.items}>
                                                <motion.div className={styles.imagestyle} whileHover={{ scale: 1.02 }}>
                                                    <img src={Catalog} alt='Catalog' />
                                                </motion.div>
                                                <motion.div className={styles.imagestyle} whileHover={{ scale: 1.02 }}>
                                                    <img src={Catalog2} alt='Catalog2' />
                                                </motion.div>
                                                <div className={styles.bottombutton}>
                                                    <button>Catalog Photos</button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

