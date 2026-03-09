'use client'
import React from 'react'
import styles from './whyChoose.module.scss';
import MediaIcon from '@/icons/mediaIcon';
import { motion } from 'framer-motion';
import CategoriesIcon from '@/icons/categoriesIcon';
import BrandIcon from '@/icons/brandIcon';
import FlashIcon from '@/icons/flashIcon';
import StarIcon from '@/icons/starIcon';

const Vec1 = '/assets/images/vec1.png';

export default function WhyChoose() {
    const chooseData = [
        {
            icon: <MediaIcon />,
            title: "Ultra HD 4K Quality",
            desc: "Every AI photo is generated in 4K resolution with perfect studio lighting — ready for print catalogs and digital stores."
        },
        {
            icon: <CategoriesIcon />,
            title: "Every Fashion Category Covered",
            desc: "From Sarees & Lehengas to Blazers, Jeans & Kids wear — Glamolic AI supports all Indian and western fashion categories."
        },
        {
            icon: <MediaIcon />,
            title: "Download in Any Format",
            desc: "Get your AI photos as individual files, bulk ZIPs or professional PDFs — instantly ready to upload anywhere."
        },
        {
            icon: <BrandIcon />,
            title: "Brand Consistency",
            desc: "Maintain a consistent model look across all your product images with our model consistency feature."
        },
        {
            icon: <FlashIcon />,
            title: "Lightning Fast",
            desc: "No booking, no waiting, no editing rounds. Get professional AI fashion photos generated in under 30 seconds."
        },
        {
            icon: <StarIcon />,
            title: "Multiple Variations",
            desc: "Generate multiple poses, backgrounds and model styles per product — pick the best shot for each platform."
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className={styles.whyChooseAlignment}>
            <div className='container'>
                <motion.div
                    className={styles.title}
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2>Why Choose Glamolic AI</h2>
                </motion.div>
                <motion.div
                    className={styles.grid}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {
                        chooseData.map((item, i) => {
                            return (
                                <motion.div
                                    className={styles.items}
                                    key={i}
                                    variants={itemVariants}
                                    whileHover={{
                                        y: -10,
                                    }}
                                >
                                    <div className={styles.itemsGrid}>
                                        <div className={styles.icon}>
                                            {item.icon}
                                        </div>
                                        <h3>{item.title}</h3>
                                    </div>
                                    <p>{item.desc}</p>
                                    <div className={styles.vecIcon}>
                                        <img src={Vec1} alt='Vec1' />
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

