'use client'
import React from 'react'
import styles from './simpleAffordable.module.scss';
import RightWhiteIcon from '@/icons/rightWhiteIcon';
import { motion } from 'framer-motion';

const FlowerImage = '/assets/images/flower.png'
const LineBoxOne = '/assets/images/linebox1.png';
const LineBoxTwo = '/assets/images/linebox2.png';

export default function SimpleAffordable() {
    const pricingData = [
        {
            label: "Starter",
            price: "₹999",
            subtext: "+18% GST applies. Includes 40 credits.",
            features: [
                "225 Image credits",
                "All categories access",
                "Up to 4k resolution",
                "Premium backgrounds",
                "Model consistency",
                "Background consistency",
                "Priority support"
            ]
        },
        {
            label: "Growth",
            price: "₹4,999",
            subtext: "+18% GST applies. Includes 225 credits.",
            features: [
                "225 Flexible Image Credits",
                "Unlimited Category Access",
                "Ultra HD 4K Exports",
                "Exclusive Premium Backgrounds",
                "Consistent Model Identity",
                "Uniform Background Styling",
                "Fast Priority Support"
            ],
            isPopular: true
        },
        {
            label: "Scale",
            price: "₹9,999",
            subtext: "+18% GST applies. Includes 500 credits.",
            features: [
                "225 Image credits",
                "All categories access",
                "Up to 4k resolution",
                "Premium backgrounds",
                "Model consistency",
                "Background consistency",
                "Priority support"
            ]
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

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <div className={styles.simpleAffordable}>
            <motion.div
                className={styles.leftVec}
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
            >
                <img src={LineBoxOne} alt='LineBoxOne' />
            </motion.div>
            <motion.div
                className={styles.bottom}
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
            >
                <img src={LineBoxTwo} alt='LineBoxTwo' />
            </motion.div>
            <div className='container'>
                <motion.div
                    className={styles.title}
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2>
                        Simple, Affordable & Scalable
                    </h2>
                </motion.div>
                <motion.div
                    className={styles.groupButtonCenter}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <div className={styles.groupButton}>
                        <button className={styles.active}>
                            Regular Plans
                        </button>
                        <button>
                            Corporate Plans
                        </button>
                    </div>
                </motion.div>
                <motion.div
                    className={styles.grid}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {
                        pricingData.map((item, index) => {
                            return (
                                <motion.div
                                    className={`${styles.items} ${item.isPopular ? styles.popularItem : ''}`}
                                    key={index}
                                    variants={cardVariants}
                                    whileHover={{ y: -10 }}
                                >
                                    {item.isPopular && (
                                        <div className={styles.popularBadge}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M18 2H6c-1.103 0-2 .897-2 2v2c0 1.954 1.487 3.561 3.393 3.903C8.163 11.411 10.329 12 12 12s3.837-.589 4.607-2.097C18.513 9.561 20 7.954 20 6V4c0-1.103-.897-2-2-2zm-12 4V4h1v2c0 .903-.385 1.716-1 2.275V6.275c-.583-.456-1-1.161-1-1.936V4h1zM18 8.275c-.615-.559-1-1.372-1-2.275V4h1v2c0 .775-.417 1.48-1 1.936v.339zM12 14c-2.206 0-4 1.794-4 4v2h8v-2c0-2.206-1.794-4-4-4z" />
                                            </svg>
                                            Most Popular
                                        </div>
                                    )}
                                    <div className={styles.infoBox}>
                                        <button>
                                            {item.label}
                                        </button>
                                        <h3>
                                            {item.price} <sub>/one-time</sub>
                                        </h3>
                                        <p>
                                            {item.subtext}
                                        </p>
                                        <div className={styles.image}>
                                            <img src={FlowerImage} alt='FlowerImage' />
                                        </div>
                                    </div>
                                    <div className={styles.allDetails}>
                                        {item.features.map((feature, idx) => (
                                            <span key={idx}>{feature}</span>
                                        ))}
                                    </div>
                                    <div className={styles.buttonAlignment}>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Get Stated Now
                                            <RightWhiteIcon />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )
                        })
                    }
                </motion.div>
            </div>
        </div>
    )
}

