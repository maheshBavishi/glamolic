'use client'
import React from 'react'
import styles from './readytoTransform.module.scss';
import RightWhiteIcon from '@/icons/rightWhiteIcon';
import { motion } from 'framer-motion';

const ModelImage1 = '/assets/images/modal1.png';
const ModelImage2 = '/assets/images/modal2.png';

export default function ReadytoTransform() {
    const slideFadeLeft = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.7, ease: "easeOut" }
        }
    };

    return (
        <div className={styles.readytoTransform}>
            <div className='container'>
                <motion.div
                    className={styles.box}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <div className={styles.grid}>
                        <motion.div className={styles.griditems} variants={slideFadeLeft}>
                            <div className={styles.content}>
                                <h2>
                                    Ready to transform your fashion photography?
                                </h2>
                                <p>
                                    Join hundreds of brand's already using GlamolicAI to create stunning product images. Start your free
                                    trial today!
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Start Generating Free
                                    <RightWhiteIcon />
                                </motion.button>
                            </div>
                        </motion.div>
                        <div className={styles.griditems}>
                            <motion.div className={styles.secGrid} variants={containerVariants}>
                                <motion.div className={styles.secGriditems} variants={cardVariants}>
                                    <motion.div
                                        className={styles.itemsDesign}
                                        whileHover={{ y: -10 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <div className={styles.imageBox}>
                                            <img src={ModelImage1} alt='ModelImage1' />
                                        </div>
                                        <div className={styles.contentBox}>
                                            <h4>
                                                Women
                                            </h4>
                                            <ul>
                                                <li>Saree</li>
                                                <li> Lehengas</li>
                                                <li>Kurtis & More</li>
                                            </ul>
                                            <motion.button
                                                whileHover={{ scale: 1.05, x: 5 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Explore
                                                <RightWhiteIcon />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                </motion.div>
                                <motion.div className={styles.secGriditems} variants={cardVariants}>
                                    <motion.div
                                        className={styles.itemsDesign}
                                        whileHover={{ y: -10 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <div className={styles.imageBox}>
                                            <img src={ModelImage2} alt='ModelImage2' />
                                        </div>
                                        <div className={styles.contentBox}>
                                            <h4>
                                                men
                                            </h4>
                                            <ul>
                                                <li>Jackets</li>
                                                <li> Sherwanis</li>
                                                <li>Blazer & More</li>
                                            </ul>
                                            <motion.button
                                                whileHover={{ scale: 1.05, x: 5 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Explore
                                                <RightWhiteIcon />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                </motion.div>

                            </motion.div>
                        </div>
                    </div>

                </motion.div>
            </div>
        </div>
    )
}

