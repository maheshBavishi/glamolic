'use client'
import React, { useState } from 'react'
import styles from './faqSection.module.scss';
import RightWhiteIcon from '@/icons/rightWhiteIcon';
import PlusIcon from '@/icons/plusIcon';
import { motion, AnimatePresence } from 'framer-motion';

const LineBoxOne = '/assets/images/linebox1.png';
const LineBoxTwo = '/assets/images/linebox2.png';
const ProfileGroup = '/assets/icons/profile-group.svg';

const faqData = [
    {
        question: 'What is Glamolic AI?',
        answer: 'Glamolic AI is an AI-powered fashion visualization platform that converts your basic product photos into professional model and studio-quality images instantly — without photoshoots, models, or expensive setups.',
    },
    {
        question: 'How does Glamolic AI work?',
        answer: 'Simply upload your product photo, choose a model or background style, and our AI generates studio-quality visuals in seconds. No technical skills or design experience required.',
    },
    {
        question: 'Is Glamolic AI free to use?',
        answer: 'Glamolic AI offers a free trial so you can experience the platform. After the trial, flexible pricing plans are available to suit businesses of all sizes — from startups to enterprise brands.',
    },
    {
        question: 'What types of products can I use with Glamolic AI?',
        answer: 'Glamolic AI works with a wide range of fashion products including clothing, accessories, footwear, and jewelry. Our AI is trained to handle diverse product categories with high accuracy.',
    },
    {
        question: 'Do I need a professional photographer?',
        answer: 'Not at all! Glamolic AI is designed to turn even basic smartphone photos into professional-grade visuals. You can skip expensive photoshoots entirely and still get stunning results.',
    },
    {
        question: 'Can I customize the models and backgrounds?',
        answer: 'Yes! You can choose from a variety of AI-generated models with different poses, body types, and ethnicities. You can also select or customize studio backgrounds to match your brand aesthetic.',
    },
];

export default function FaqSection() {
    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const slideInLeft = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
    };

    const slideInRight = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
    };

    return (
        <div className={styles.faqSectionAlignment}>
            <motion.div
                className={styles.leftVec}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={slideInLeft}
            >
                <img src={LineBoxOne} alt='LineBoxOne' />
            </motion.div>
            <motion.div
                className={styles.bottom}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={slideInRight}
            >
                <img src={LineBoxTwo} alt='LineBoxTwo' />
            </motion.div>
            <div className='container'>
                <div className={styles.grid}>
                    <motion.div
                        className={styles.griditems}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                    >
                        <motion.div className={styles.title} variants={fadeInUp}>
                            <h2>
                                Frequently Asked Questions
                            </h2>
                        </motion.div>
                        <motion.div className={styles.box} variants={fadeInUp}>
                            <img src={ProfileGroup} alt='ProfileGroup' />
                            <h3>
                                Still confused? We'll guide you.
                            </h3>
                            <p>
                                Our team will help you create your first AI fashion visuals and set up the perfect workflow for your store —
                                step by step.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Start Free Setup
                                <RightWhiteIcon />
                            </motion.button>
                        </motion.div>
                    </motion.div>
                    <div className={styles.griditems}>
                        <motion.div
                            className={styles.faqMainBox}
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            {faqData.map((faq, index) => (
                                <motion.div
                                    className={styles.lineBox}
                                    key={index}
                                    variants={fadeInUp}
                                >
                                    <div className={styles.faqHeader} onClick={() => handleToggle(index)}>
                                        <h4>{faq.question}</h4>
                                        <motion.div
                                            className={styles.icon}
                                            animate={{ rotate: openIndex === index ? 45 : 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        >
                                            <PlusIcon />
                                        </motion.div>
                                    </div>
                                    <AnimatePresence initial={false}>
                                        {openIndex === index && (
                                            <motion.div
                                                className={styles.faqBody}
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                                style={{ overflow: 'hidden' }}
                                            >
                                                <div className={styles.spacing}>
                                                    <p>{faq.answer}</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

