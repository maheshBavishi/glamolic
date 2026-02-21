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
            title: "High-Quality Images",
            desc: "Generate stunning 4K resolution images perfect for print and digital media with professional studio lighting."
        },
        {
            icon: <CategoriesIcon />,
            title: "Multiple Categories",
            desc: "Support for Women, Men, and Kids clothing with diverse subcategories including traditional & western wear."
        },
        {
            icon: <MediaIcon />,
            title: "Easy Download",
            desc: "Download individual images, bulk ZIP files, or professional PDFs ready for printing and sharing"
        },
        {
            icon: <BrandIcon />,
            title: "Brand Consistency",
            desc: "Maintain consistent model looks across all your product images with our model consistency feature."
        },
        {
            icon: <FlashIcon />,
            title: "Lightning Fast",
            desc: "Generate professional photos in seconds, not days. Skip the traditional photoshoot hassle."
        },
        {
            icon: <StarIcon />,
            title: "Multiple Variations",
            desc: "Generate multiple image variations per product to find the perfect shot for your campaign."
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
                    <h2>Why Choose GlamolicAI</h2>
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

