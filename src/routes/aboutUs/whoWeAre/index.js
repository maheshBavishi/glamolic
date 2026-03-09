import React from 'react'
import styles from './whoWeAre.module.scss';
import AiIcon from '@/icons/aiIcon';
import RightWhiteIcon from '@/icons/rightWhiteIcon';
const WhoweareImage = '/assets/images/whoweare.png';
export default function WhoWeAre() {
    return (
        <div className={styles.whoWeAreAlignment}>
            <div className='container'>
                <div className={styles.title}>
                    <h2>
                        Who We Are
                    </h2>
                </div>
                <div className={styles.whiteBox}>
                    <div>
                        <div className={styles.lightBox}>
                            <img src={WhoweareImage} alt='WhoweareImage' />
                        </div>
                    </div>
                    <div className={styles.rightContent}>
                        <div className={styles.text}>
                            <h2>
                                The Future of Fashion Photography
                            </h2>
                            <p>
                                Glamolic AI is a next-generation platform that empowers clothing brands to create professional fashion photography without the traditional overhead. From AI-generated models to complete catalog shoots, we're redefining how
                                brands visualize fashion.
                            </p>
                        </div>
                        <div className={styles.allIcontextAlignment}>
                            <div className={styles.iconGrid}>
                                <div className={styles.icon}>
                                    <AiIcon />
                                </div>
                                <div>
                                    <h3>
                                        Multiple Categories
                                    </h3>
                                    <p>
                                        Cutting-edge generative AI trained on fashion data
                                    </p>
                                </div>
                            </div>
                            <div className={styles.iconGrid}>
                                <div className={styles.icon}>
                                    <AiIcon />
                                </div>
                                <div>
                                    <h3>
                                        Ecommerce Ready
                                    </h3>
                                    <p>
                                        Optimized for product listings and catalogs
                                    </p>
                                </div>
                            </div>
                            <div className={styles.iconGrid}>
                                <div className={styles.icon}>
                                    <AiIcon />
                                </div>
                                <div>
                                    <h3>
                                        Fashion Brands
                                    </h3>
                                    <p>
                                        Built specifically for the fashion industry
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.buttonDesign} >
                            <button

                            >
                                Generate Photoshoot
                                <RightWhiteIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
