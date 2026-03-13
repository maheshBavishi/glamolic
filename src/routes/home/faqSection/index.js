"use client";
import React, { useState } from "react";
import styles from "./faqSection.module.scss";
import RightWhiteIcon from "@/icons/rightWhiteIcon";
import PlusIcon from "@/icons/plusIcon";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const LineBoxOne = "/assets/images/linebox1.png";
const LineBoxTwo = "/assets/images/linebox2.png";
const ProfileGroup = "/assets/icons/profile-group.svg";

const faqData = [
  {
    question: "What is Glamolic AI?",
    answer:
      "Glamolic AI is an AI-powered fashion photography tool that lets clothing brands generate realistic model photos from a single product image — perfect for Shopify, Amazon, Myntra and ecommerce catalogs.",
  },
  {
    question: "How does Glamolic AI work?",
    answer:
      "Simply upload your clothing image, choose your model type, pose and background — and our AI generates a professional fashion photoshoot in seconds. No editing skills needed.",
  },
  {
    question: "Is Glamolic AI free to use?",
    answer:
      "Glamolic AI offers a free trial so you can test the platform before purchasing. Paid plans start at ₹999 and include credits for generating professional AI fashion photos.",
  },
  {
    question: "What types of clothing can I use with Glamolic AI?",
    answer:
      "Glamolic AI supports all fashion categories — Women's ethnic wear (Sarees, Lehengas, Kurtis), Men's clothing (Blazers, Sherwanis, Jackets), Kids wear, and western fashion. Perfect for any clothing brand.",
  },
  {
    question: "Do I need a professional photographer or studio?",
    answer:
      "No. Glamolic AI is built specifically for fashion photoshoot without a photographer. Just upload your clothing image and our AI handles all the lighting, model placement and background — automatically.",
  },
  {
    question: "Can I customize the AI models and backgrounds?",
    answer:
      "Yes! You can choose model gender, body type, skin tone, age group and face style. For backgrounds, select from studio setups, outdoor scenes, street environments.",
  },
  {
    question: "Can I use Glamolic AI photos for Amazon, Shopify or Myntra?",
    answer:
      "Yes! Glamolic AI generates high-resolution 4K images that meet the product photo requirements for Amazon, Shopify, Myntra, Meesho and all major ecommerce platforms.",
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
        delayChildren: 0.2,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className={styles.faqSectionAlignment}>
      <motion.div className={styles.leftVec} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideInLeft}>
        <img src={LineBoxOne} alt="LineBoxOne" />
      </motion.div>
      <motion.div className={styles.bottom} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideInRight}>
        <img src={LineBoxTwo} alt="LineBoxTwo" />
      </motion.div>
      <div className="container">
        <div className={styles.grid}>
          <motion.div className={styles.griditems} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
            <motion.div className={styles.title} variants={fadeInUp}>
              <h2>Frequently Asked Questions</h2>
            </motion.div>
            <motion.div className={styles.box} variants={fadeInUp}>
              <img src={ProfileGroup} alt="ProfileGroup" />
              <h3>Need help getting started?</h3>
              <p>Our onboarding team will walk you through your first AI photoshoot and set up the perfect workflow for your ecommerce store.</p>
              <Link href="/contact-us">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Chat With Us
                  <RightWhiteIcon />
                </motion.button>{" "}
              </Link>
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
                <motion.div className={styles.lineBox} key={index} variants={fadeInUp}>
                  <div className={styles.faqHeader} onClick={() => handleToggle(index)}>
                    <h4>{faq.question}</h4>
                    <motion.div
                      className={styles.icon}
                      animate={{ rotate: openIndex === index ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <PlusIcon />
                    </motion.div>
                  </div>
                  <AnimatePresence initial={false}>
                    {openIndex === index && (
                      <motion.div
                        className={styles.faqBody}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        style={{ overflow: "hidden" }}
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
  );
}
