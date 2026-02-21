'use client'
import React from 'react'
import styles from './believeItsAi.module.scss';
import RightWhiteIcon from '@/icons/rightWhiteIcon';
import { motion } from 'framer-motion';

const AiImage = '/assets/images/ai-img.png';
const CheckIcon = '/assets/icons/check.svg';

export default function BelieveItsAi() {
    const slideInLeft = {
        hidden: { opacity: 0, x: -60 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const slideInRight = {
        hidden: { opacity: 0, x: 60 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className={styles.believeItsAi}>
            <div className='container'>
                <motion.div
                    className={styles.box}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <div className={styles.grid}>
                        <motion.div variants={slideInLeft}>
                            <motion.div
                                className={styles.imageBox}
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img src={AiImage} alt='AiImage' />
                            </motion.div>
                        </motion.div>
                        <motion.div variants={slideInRight}>
                            <motion.div className={styles.content} variants={staggerContainer}>
                                <motion.h3 variants={fadeInUp}>
                                    So real you won’t believe it’s AI-generated!
                                </motion.h3>
                                <motion.p variants={fadeInUp}>
                                    When you apply a style to your photo, glamolic AI doesn't just overlay elements it intelligently generates them to produce high quality, realistic images that blend seamlessly with your original photo for a
                                    natural, lifelike result.
                                </motion.p>
                                <motion.div className={styles.allIconTextAlignment} variants={staggerContainer}>
                                    {[
                                        "Realistic lighting, shadows & reflections",
                                        "Natural model blending in enviornments",
                                        "Fine tuned studio quality results"
                                    ].map((text, idx) => (
                                        <motion.div key={idx} className={styles.iconText} variants={fadeInUp}>
                                            <img src={CheckIcon} alt='CheckIcon' />
                                            <span>{text}</span>
                                        </motion.div>
                                    ))}
                                </motion.div>
                                <motion.div className={styles.buttonDesign} variants={fadeInUp}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Generate Photoshoot
                                        <RightWhiteIcon />
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

