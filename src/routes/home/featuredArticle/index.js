'use client'
import React from 'react'
import styles from './featuredArticle.module.scss';
import RightIcon from '@/icons/rightIcon';
import RightBlackIcon from '@/icons/rightBlackIcon';
import { motion } from 'framer-motion';

const BlogImage = '/assets/images/blog-img.png';

export default function FeaturedArticle() {
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
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const articles = [
        { id: 1 },
        { id: 2 },
        { id: 3 }
    ];

    return (
        <div className={styles.featuredArticle}>
            <div className='container'>
                <motion.div
                    className={styles.title}
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2>
                        Featured Article
                    </h2>
                </motion.div>
                <motion.div
                    className={styles.grid}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {articles.map((item) => (
                        <motion.div
                            key={item.id}
                            className={styles.items}
                            variants={cardVariants}
                            whileHover={{ y: -8 }}
                        >
                            <div className={styles.imagebox}>
                                <motion.img
                                    src={BlogImage}
                                    alt='BlogImage'
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.4 }}
                                />
                            </div>
                            <div className={styles.content}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Dec 29,2025
                                </motion.button>
                                <h3>
                                    How AI Photoshoots Are Replacing Traditional Fashion Photography
                                </h3>
                                <p>
                                    Discover how brands are saving thousands on models, studios and editing while producing unlimited catalog images
                                    in minutes.
                                </p>
                                <motion.div
                                    className={styles.readmore}
                                    whileHover={{ gap: "12px" }}
                                >
                                    <span>
                                        Read More
                                    </span>
                                    <RightBlackIcon />
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}

