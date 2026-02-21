'use client'
import React from 'react'
import styles from './createPerfectPhotos.module.scss';
import RightWhiteIcon from '@/icons/rightWhiteIcon';
import { motion } from 'framer-motion';

const SliderImage = '/assets/images/slider.png';
const SliderImage2 = '/assets/images/slider2.png';
const PerfectLeft = '/assets/images/perfect-left.png';
const PerfectRight = '/assets/images/perfect-right.png';
const CheckIcon = '/assets/icons/check.svg';

export default function CreatePerfectPhotos() {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            },
        },
    };

    const slideInLeft = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    const slideInRight = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    const floatingBackground = {
        initial: { opacity: 0 },
        animate: {
            opacity: 0.5,
            y: [0, -20, 0],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className={styles.createPerfectPhotos}>
            <motion.div
                className={styles.leftAlignment}
                initial="initial"
                animate="animate"
                variants={floatingBackground}
            >
                <img src={PerfectLeft} alt='PerfectLeft' />
            </motion.div>
            <motion.div
                className={styles.rightAlignment}
                initial="initial"
                animate="animate"
                variants={floatingBackground}
            >
                <img src={PerfectRight} alt='PerfectRight' />
            </motion.div>
            <div className='container'>
                <motion.div
                    className={styles.title}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeIn}
                >
                    <h2>
                        Create Perfect Photos for Every Fashion Category
                    </h2>
                </motion.div>
                <div className={styles.allBoxAlignment}>
                    {[
                        {
                            title: "Create Studio-Quality Model Photos From Your Outfit",
                            text: "Turn a single clothing image into a professional photoshoot with realistic models, lighting and branded backgrounds. Generate high-resolution catalog images instantly no photographers, studio or manual editing needed.",
                            checks: [
                                "Choose model gender, body type & ethnicity",
                                "Select age group & face style matching your brand",
                                "Multiple poses & fashion expressions",
                                "Studio, outdoor & custom backgrounds"
                            ],
                            image: SliderImage,
                            note: "From Product Photo to Realistic Model Shoot in Seconds"
                        },
                        {
                            title: "Create Fashion Videos Without Recording",
                            text: "Create cinematic fashion videos from your outfit image with natural motion and camera movement. Produce ad-ready reels and promotional clips in seconds no filming, actors or editing required.",
                            checks: [
                                "Natural walking & turning motion",
                                "Multiple camera angles & zoom styles",
                                "Indoor, street & runway environments",
                                "Smooth cinematic movement"
                            ],
                            image: SliderImage2,
                            note: "From Product Photo to Realistic Model Shoot in Seconds"
                        }
                    ].map((box, idx) => (
                        <motion.div
                            key={idx}
                            className={styles.box}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={staggerContainer}
                        >
                            <div className={styles.grid}>
                                <motion.div className={styles.items} variants={slideInLeft}>
                                    <div className={styles.content}>
                                        <motion.h3 variants={fadeIn}>{box.title}</motion.h3>
                                        <motion.p variants={fadeIn}>{box.text}</motion.p>
                                        <motion.div className={styles.allIconTextAlignment} variants={staggerContainer}>
                                            {box.checks.map((check, i) => (
                                                <motion.div key={i} className={styles.iconText} variants={fadeIn}>
                                                    <img src={CheckIcon} alt='CheckIcon' />
                                                    <span>{check}</span>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                        <motion.div className={styles.buttonDesign} variants={fadeIn}>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Generate Photoshoot
                                                <RightWhiteIcon />
                                            </motion.button>
                                        </motion.div>
                                    </div>
                                </motion.div>
                                <motion.div className={styles.items} variants={slideInRight}>
                                    <motion.div
                                        className={styles.box}
                                        whileHover={{ y: -10 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <div className={styles.image}>
                                            <img src={box.image} alt='SliderImage' />
                                        </div>
                                        <div className={styles.text}>
                                            <ul>
                                                <li>{box.note}</li>
                                            </ul>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

