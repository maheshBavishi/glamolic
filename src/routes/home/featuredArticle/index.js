"use client";
import React from "react";
import styles from "./featuredArticle.module.scss";
import RightIcon from "@/icons/rightIcon";
import RightBlackIcon from "@/icons/rightBlackIcon";
import { motion } from "framer-motion";
import Link from "next/link";
import moment from "moment";

const BlogImage = "/assets/images/blog-img.png";

export default function FeaturedArticle({ Blogs }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
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

  const articles = [{ id: 1 }, { id: 2 }, { id: 3 }];

  return (
    <div className={styles.featuredArticle}>
      <div className="container">
        <motion.div
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Featured Article</h2>
        </motion.div>
        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {Blogs?.map((item, index) => (
            <motion.div key={index} className={styles.items} variants={cardVariants} whileHover={{ y: -8 }}>
              <div className={styles.imagebox}>
                <motion.img
                  src={`${process.env.NEXT_PUBLIC_CMS_IMAGE_URL}${item?.attributes?.coverImage?.data?.attributes?.url}`}
                  alt="BlogImage"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div className={styles.content}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  {moment(item?.attributes?.createdAt).format("DD MMM, YYYY")}
                </motion.button>
                <h3>{item?.attributes?.title}</h3>
                <p>{item?.attributes?.shortDescription}</p>
                <Link href={`/blog/${item?.attributes?.slug}`}>
                  <motion.div className={styles.readmore} whileHover={{ gap: "12px" }}>
                    <span>Read More</span>
                    <RightBlackIcon />
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
