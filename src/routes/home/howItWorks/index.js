'use client'
import React from 'react'
import styles from './howItWorks.module.scss';
import WhyChoose from '../whyChoose';
import BelieveItsAi from '../believeItsAi';
import { motion } from 'framer-motion';

const StepOne = '/assets/images/step1.png';
const StepTwo = '/assets/images/step3.png';
const StepThree = '/assets/images/step2.png';

export default function HowItWorks() {
    const steps = [
        {
            step: "Step 1",
            image: StepOne,
            title: "Upload Your Outfit",
            desc: "Simply upload your clothing photo — Saree, Kurti, Lehenga, Western wear or any fashion item"
        },
        {
            step: "Step 2",
            image: StepTwo,
            title: "Set Your Style Preferences",
            desc: " Choose model gender, background type, image size and resolution — all in a few clicks"
        },
        {
            step: "Step 3",
            image: StepThree,
            title: "Download & Publish Instantly",
            desc: "Your catalog-ready AI model photos are generated in seconds — download and upload directly to Shopify, Amazon or Myntra"
        }
    ];

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

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    return (
        <div className={styles.howItWorksPage} id='howitwork'>
            <div className='container'>
                <motion.div
                    className={styles.title}
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2>How It Works</h2>
                </motion.div>
                <motion.div
                    className={styles.grid}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {steps.map((item, index) => (
                        <motion.div
                            key={index}
                            className={styles.items}
                            variants={itemVariants}
                            whileHover={{ y: -8 }}
                        >
                            <div className={styles.image}>
                                <img src={item.image} alt={item.title} />
                            </div>
                            <div className={styles.detailsBox}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {item.step}
                                </motion.button>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
            <BelieveItsAi />
            <WhyChoose />
        </div>
    )
}

