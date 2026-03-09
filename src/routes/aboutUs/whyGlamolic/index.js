import React from 'react'
import styles from './whyGlamolic.module.scss';
import CheckIcon from '@/icons/checkIcon';
import CheckStarIcon from '@/icons/checkStarIcon';
const SliderImage = '/assets/images/slider.png';
export default function WhyGlamolic() {
    return (
        <div className={styles.whyGlamolic}>
            <div className='container'>
                <div className={styles.title}>
                    <h2>
                        Why Glamolic AI
                    </h2>
                </div>
                <div className={styles.whitebox}>
                    <div className={styles.items}>
                        <div className={styles.text}>
                            <h2>
                                Built for modern fashion brands
                            </h2>
                            <p>
                                Create
                                high-quality fashion photography without expensive photoshoots. Generate stunning model images instantly with AI.
                            </p>
                        </div>
                        <div className={styles.allIcontextAlignment}>
                            <div className={styles.icongrid}>
                                <CheckStarIcon />
                                <span>
                                    Saves 80% cost compared to traditional photoshoots
                                </span>
                            </div>
                            <div className={styles.icongrid}>
                                <CheckStarIcon />
                                <span>
                                    generate professional images in seconds
                                </span>
                            </div>
                            <div className={styles.icongrid}>
                                <CheckStarIcon />
                                <span>
                                    no studio, photographer, or modals required
                                </span>
                            </div>
                            <div className={styles.icongrid}>
                                <CheckStarIcon />
                                <span>
                                    unlimited scalability for growing brands
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.items}>
                        <div className={styles.lightbox}>
                            <img src={SliderImage} alt='SliderImage' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
