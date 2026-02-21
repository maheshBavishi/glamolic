'use client'
import React from 'react'
import styles from './trustedByBrands.module.scss';
import { motion } from 'framer-motion';


const reviews = [
    {
        text: "smallest.ai, led by Sudarshan, has achieved an outstanding level of TTS quality with significantly fewer resources, a leaner team, and minimal PR or fundraising compared to others in the space. It's a masterclass in building with focus and efficiency—credit where it's due!",
        name: "Tony Gordon",
        role: "Co Founder | Gordon Salon US",
        img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        text: "Glamolic transformed our brand identity completely. The attention to detail in every product is extraordinary. Our customers constantly ask what we use, and the answer is always Glamolic.",
        name: "Sophia Reynolds",
        role: "CEO | Luxe Beauty Co.",
        img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        text: "I've tried dozens of beauty brands over the years, but Glamolic's formulations are in a league of their own. Sustainable, effective, and absolutely stunning results every single time.",
        name: "Marcus Webb",
        role: "Director | The Glow Studio",
        img: "https://randomuser.me/api/portraits/men/56.jpg",
    },
    {
        text: "Our partnership with Glamolic has boosted our salon's revenue by over 40%. Clients come back specifically for the Glamolic treatments, and the results speak for themselves.",
        name: "Priya Sharma",
        role: "Owner | Priya's Beauty Lounge",
        img: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
        text: "The product quality is consistently exceptional. Glamolic has not only elevated our offerings but has redefined what luxury beauty means for our brand and our clientele.",
        name: "James Calloway",
        role: "VP Marketing | BeautyFirst Group",
        img: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    {
        text: "Switching to Glamolic was the best decision we made this year. The formulations are clean, cruelty-free, and the results are visible from the very first use. Highly recommended!",
        name: "Elena Vasquez",
        role: "Founder | Pure Skin Clinic",
        img: "https://randomuser.me/api/portraits/women/12.jpg",
    },
    {
        text: "Glamolic's team genuinely cares about partnership success. They went above and beyond to customize solutions for our market. It's rare to find this level of commitment in any industry.",
        name: "Daniel Park",
        role: "COO | Radiance Brands Inc.",
        img: "https://randomuser.me/api/portraits/men/76.jpg",
    },
    {
        text: "Since introducing Glamolic products to our shelves, customer satisfaction scores have skyrocketed. The brand practically sells itself—the quality and packaging are absolutely world-class.",
        name: "Amara Osei",
        role: "Retail Manager | Beauty Hub Africa",
        img: "https://randomuser.me/api/portraits/women/90.jpg",
    },
    {
        text: "Working with Glamolic has been a game-changer. Their innovation pipeline is impressive, and their commitment to sustainable practices aligns perfectly with our brand values.",
        name: "Lisa Tran",
        role: "Head of Partnerships | EcoGlow",
        img: "https://randomuser.me/api/portraits/women/55.jpg",
    },
];

const col1 = reviews.slice(0, 3);
const col2 = reviews.slice(3, 6);
const col3 = reviews.slice(6, 9);

function MarqueeColumn({ cards, duration = 20, reverse = false }) {
    // Duplicate cards to create seamless infinite scroll
    const doubled = [...cards, ...cards];

    return (
        <div className={styles.items}>
            <motion.div
                className={styles.marqueeTrack}
                animate={{
                    y: reverse ? ['-50%', '0%'] : ['0%', '-50%'],
                }}
                transition={{
                    duration,
                    ease: 'linear',
                    repeat: Infinity,
                    repeatType: 'loop',
                }}
            >
                {doubled.map((review, idx) => (
                    <div className={styles.box} key={idx}>
                        <p>{review.text}</p>
                        <div className={styles.profileGrid}>
                            <img src={review.img} alt={review.name} />
                            <div>
                                <h4>{review.name}</h4>
                                <span>{review.role}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

export default function TrustedByBrands() {
    return (
        <motion.div
            className={styles.trustedByBrands}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <div className='containersm'>
                <motion.div
                    className={styles.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h2>Trusted by brands</h2>
                </motion.div>
                <div className={styles.grid}>
                    <MarqueeColumn cards={col1} duration={18} reverse={false} />
                    <MarqueeColumn cards={col2} duration={24} reverse={true} />
                    <MarqueeColumn cards={col3} duration={20} reverse={false} />
                </div>
            </div>

        </motion.div>
    );
}
