'use client'
import React from 'react'
import styles from './trustedByBrands.module.scss';
import { motion } from 'framer-motion';


const reviews = [
    {
        text: "Glamolic AI completely changed how we shoot our collections. We used to spend $3,000+ per photoshoot. Now we generate better photos in minutes. Every Shopify seller needs this.",
        name: "Sarah Mitchell",
        role: "Founder | StyleHaus Co. — New York, NY",
    },
    {
        text: "We scaled from 50 to 500 product listings in one month because of Glamolic AI. The model photos look so real, our conversion rate jumped by 38% overnight.",
        name: "James Whitfield",
        role: "CEO | Urban Thread Apparel — Los Angeles, CA",
    },
    {
        text: "I was skeptical at first, but the results blew me away. Our Amazon listings with Glamolic AI photos get 2x more clicks than our old product shots. Absolutely worth it.",
        name: "Ashley Brooks",
        role: "eCommerce Manager | Bloom Boutique — Austin, TX",
    },
    {
        text: "As a small clothing brand, hiring models and photographers was never in our budget. Glamolic AI gave us the same quality at a fraction of the cost. Game changer.",
        name: "David Nguyen",
        role: "Co-Founder | FitFirst Fashion — San Francisco, CA",
    },
    {
        text: "Our Instagram engagement doubled after we switched to Glamolic AI photos. The images are cinematic, realistic and on-brand every single time. Our customers think we hired a top photographer.",
        name: "Rachel Torres",
        role: "Head of Marketing | Velvet & Vine — Miami, FL",
    },
    {
        text: "We sell on Myntra, Amazon and our own Shopify store. Glamolic AI keeps our product photos consistent across every platform. The brand consistency feature alone is worth the price.",
        name: "Tyler Johnson",
        role: "Owner | Midwest Threads — Chicago, IL",
    },
    {
        text: "I've tested every AI photo tool out there. Nothing comes close to Glamolic AI's realism. The fabric texture, lighting and model blending is on another level entirely.",
        name: "Megan Clarke",
        role: "Creative Director | Luxe Label NYC — New York, NY",
    },
    {
        text: "We launched our entire spring catalog using only Glamolic AI — no studio, no models, no photographer. Saved us over $8,000 and the photos look better than anything we've done before.",
        name: "Brandon Lee",
        role: "Founder | Pacific Styles — Seattle, WA",
    },
    {
        text: "Glamolic AI is the best investment we made this year. Our product pages look like a high-end fashion magazine. Customers spend more time browsing and our cart abandonment dropped significantly.",
        name: "Natalie Rivera",
        role: "VP of Product | Trendy Closet — Dallas, TX",
    },
    {
        text: "From upload to download in under 60 seconds. The speed is unreal and the quality never drops. Glamolic AI is now a core part of our ecommerce workflow and we can't imagine working without it.",
        name: "Chris Patel",
        role: "Operations Lead | NextGen Fashion — Boston, MA",
    },
];

const col1 = reviews.slice(0, 4);
const col2 = reviews.slice(4, 7);
const col3 = reviews.slice(7, 10);

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
