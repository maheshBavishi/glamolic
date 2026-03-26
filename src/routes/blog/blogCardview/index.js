"use client";
import React, { useRef } from "react";
import styles from "./blogCardview.module.scss";
import RightBlackIcon from "@/icons/rightBlackIcon";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import moment from "moment";

const BlogImage = "/assets/images/blog-img.png";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const articles = [{ id: 1 }, { id: 2 }, { id: 3 }];

export default function BlogCardview({ Blogs, paginationData }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div className={styles.blogCardview}>
      <div className="container">
        <motion.div ref={ref} className={styles.grid} variants={containerVariants} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          {Blogs?.map((item, index) => {
            return (
              <motion.div
                key={index}
                className={styles.items}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
                style={{ willChange: "transform, opacity" }}
              >
                <div className={styles.imagebox}>
                  <motion.img
                    src={`${process.env.NEXT_PUBLIC_CMS_IMAGE_URL}${item?.attributes?.coverImage?.data?.attributes?.url}`}
                    alt="BlogImage"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{ willChange: "transform" }}
                  />
                </div>
                <div className={styles.content}>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                    {moment(item?.attributes?.createdAt).format("DD MMM, YYYY")}
                  </motion.button>
                  <h3>{item?.attributes?.title}</h3>
                  <p>{item?.attributes?.shortDescription}</p>
                  <Link href={`/blog/${item?.attributes?.slug}`}>
                    <motion.div className={styles.readmore} whileHover={{ gap: "12px" }} transition={{ duration: 0.2 }}>
                      <span>Read More</span>
                      <RightBlackIcon />
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
