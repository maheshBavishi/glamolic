import React from 'react'
import styles from './aboutUsHerobanner.module.scss';
import MagicIcon from '@/icons/magicIcon';
import DemoIcon from '@/icons/demoIcon';
const Aboutbanner = '/assets/images/about-banner.png';
export default function AboutUsHerobanner() {
    return (
        <div className={styles.aboutHerobanner}>
            <div className={styles.herobannerTopAlignment}>
                <div className='container'>
                    <div className={styles.grid}>
                        <div className={styles.griditems}>
                            <h1>
                                About Glamolic AI
                            </h1>
                            <div className={styles.textstyle}>
                                <p>
                                    The modern clothing brand's AI-powered fashion photography platform. Generate stunning model photos, catalog images, and fashion videos
                                    — instantly.
                                </p>
                            </div>
                            <div className={styles.twoButtonAlignment} >
                                <button
                                >
                                    <MagicIcon />
                                    Start Creating Magic
                                </button>
                                <button
                                    className={styles.lightButton}
                                >
                                    <DemoIcon />
                                    Watch Demo
                                </button>
                            </div>
                            <div className={styles.allTextAlignment}>
                                <div className={styles.items}>
                                    <h3>
                                        10K+
                                    </h3>
                                    <p>
                                        Images Generated
                                    </p>
                                </div>
                                <div className={styles.items}>
                                    <h3>
                                        500+
                                    </h3>
                                    <p>
                                        Happy Brands
                                    </p>
                                </div>
                                <div className={styles.items}>
                                    <h3>
                                        50+
                                    </h3>
                                    <p>
                                        Fashion Categories
                                    </p>
                                </div>
                                <div className={styles.items}>
                                    <h3>
                                        99%
                                    </h3>
                                    <p>
                                        Client satisfaction
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.griditems}>
                            <div className={styles.box}>
                                <div className={styles.image}>
                                    <img src={Aboutbanner} alt='Aboutbanner' />
                                </div>
                                <div className={styles.textBox}>
                                    <ul>
                                        <li>Transforming Fashion Photography with AI</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
