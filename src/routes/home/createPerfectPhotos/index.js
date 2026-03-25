"use client";
import RightWhiteIcon from "@/icons/rightWhiteIcon";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import styles from "./createPerfectPhotos.module.scss";
import { useAuth } from "@/context/AuthContext";

const SliderImage = "/assets/images/slider-new.png";
const SliderImage2 = "/assets/images/slider2.png";
const PerfectLeft = "/assets/images/perfect-left.png";
const PerfectRight = "/assets/images/perfect-right.png";
const DemoImage = "/assets/images/demo-img.png";
const DemoVideo = "/assets/video/demo-video.mp4";
const CheckIcon = "/assets/icons/check.svg";

export default function CreatePerfectPhotos() {
  const router = useRouter();
  const { user } = useAuth();

  const handleOnRedirect = () => {
    if (user) {
      router.push("/category-selection");
      return;
    }
    router.push("/login");
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
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
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const floatingBackground = {
    initial: { opacity: 0 },
    animate: {
      opacity: 0.5,
      y: [0, -20, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className={styles.createPerfectPhotos} id="features">
      <motion.div className={styles.leftAlignment} initial="initial" animate="animate" variants={floatingBackground}>
        <img src={PerfectLeft} alt="PerfectLeft" />
      </motion.div>
      <motion.div className={styles.rightAlignment} initial="initial" animate="animate" variants={floatingBackground}>
        <img src={PerfectRight} alt="PerfectRight" />
      </motion.div>
      <div className="container">
        <motion.div className={styles.title} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}>
          <h2>AI Fashion Photos for All Styles - All Categories - All Brands</h2>
        </motion.div>
        <div className={styles.allBoxAlignment}>

          {/* ── Card 1: AI Model Photoshoot ── */}
          <motion.div
            className={styles.box}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className={styles.grid}>
              <motion.div className={styles.items} variants={slideInLeft}>
                <div className={styles.content}>
                  <motion.h3 variants={fadeIn}>
                    Turn Your Clothing Into a Professional AI Model Photoshoot
                  </motion.h3>
                  <motion.p variants={fadeIn}>
                    Upload your outfit and get professional AI model photos in seconds. Perfect for Sarees, Lehengas, Kurtis, Western wear &amp; more. No studio. No photographer. No editing required.
                  </motion.p>
                  <motion.div className={styles.allIconTextAlignment} variants={staggerContainer}>
                    <motion.div className={styles.iconText} variants={fadeIn}>
                      <img src={CheckIcon} alt="CheckIcon" />
                      <span>AI models for Women, Men &amp; Kids clothing</span>
                    </motion.div>
                    <motion.div className={styles.iconText} variants={fadeIn}>
                      <img src={CheckIcon} alt="CheckIcon" />
                      <span>Brand-matched model appearance &amp; style</span>
                    </motion.div>
                    <motion.div className={styles.iconText} variants={fadeIn}>
                      <img src={CheckIcon} alt="CheckIcon" />
                      <span>Dynamic poses for every fashion category</span>
                    </motion.div>
                    <motion.div className={styles.iconText} variants={fadeIn}>
                      <img src={CheckIcon} alt="CheckIcon" />
                      <span>Professional studio to outdoor backgrounds</span>
                    </motion.div>
                  </motion.div>
                  <motion.div className={styles.buttonDesign} variants={fadeIn}>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleOnRedirect}>
                      Create Model Photos Now
                      <RightWhiteIcon />
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
              <motion.div className={styles.items} variants={slideInRight}>
                <motion.div className={styles.box} whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 300 }}>
                  <div className={styles.image}>
                    <img src={SliderImage} alt="SliderImage" />
                  </div>
                  <div className={styles.text}>
                    <ul>
                      <li>From Product Photo to Realistic Model Shoot in Seconds</li>
                    </ul>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* ── Card 2: Cinematic Fashion Video ── */}
          <motion.div
            className={styles.box}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className={styles.grid}>
              <motion.div className={styles.items} variants={slideInLeft}>
                <div className={styles.content}>
                  <motion.h3 variants={fadeIn}>
                    Turn Your Outfit Into a Cinematic Fashion Video Instantly
                  </motion.h3>
                  <motion.p variants={fadeIn}>
                    Just upload your clothing photo and get a professional fashion video with realistic AI models in motion. Ready for Instagram, Reels, YouTube Shorts &amp; online ads in seconds.
                  </motion.p>
                  <motion.div className={styles.allIconTextAlignment} variants={staggerContainer}>
                    <motion.div className={styles.iconText} variants={fadeIn}>
                      <img src={CheckIcon} alt="CheckIcon" />
                      <span>Realistic human motion — walk, turn &amp; pose</span>
                    </motion.div>
                    <motion.div className={styles.iconText} variants={fadeIn}>
                      <img src={CheckIcon} alt="CheckIcon" />
                      <span>Dynamic camera angles for a premium ad feel</span>
                    </motion.div>
                    <motion.div className={styles.iconText} variants={fadeIn}>
                      <img src={CheckIcon} alt="CheckIcon" />
                      <span>20+ environments — indoor, outdoor &amp; runway</span>
                    </motion.div>
                    <motion.div className={styles.iconText} variants={fadeIn}>
                      <img src={CheckIcon} alt="CheckIcon" />
                      <span>Export-ready for social media &amp; ecommerce ads</span>
                    </motion.div>
                  </motion.div>
                  <motion.div className={styles.buttonDesign} variants={fadeIn}>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleOnRedirect}>
                      Generate AI Fashion Reel
                      <RightWhiteIcon />
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
              <motion.div className={styles.items} variants={slideInRight}>
                <motion.div className={styles.box} whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 300 }}>
                  <div className={styles.twocol}>
                    <div className={styles.newItems}>
                      <img src={DemoImage} alt="DemoImage" />
                      <div className={styles.bottomAlignment}>
                        <button>
                          Before
                        </button>
                      </div>
                    </div>
                    <div className={styles.newItems}>
                      <video src={DemoVideo} alt="DemoVideo" playsInline autoPlay loop muted></video>
                      <div className={styles.bottomAlignment}>
                        <button>
                          After
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
