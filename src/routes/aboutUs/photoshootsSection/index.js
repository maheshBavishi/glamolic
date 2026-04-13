import React from 'react'
import styles from './photoshootsSection.module.scss';
const PhotoShootImage = '/assets/images/photoshoot3.png';
const CardImage1 = '/assets/images/p1.png';
const CardImage2 = '/assets/images/p2.png';
const CardImage3 = '/assets/images/p3.png';
const CardImage4 = '/assets/images/p4.png';
export default function PhotoshootsSection() {
    return (
        <div className={styles.photoshootsSection}>
            <div className='container'>
                <div className={styles.grid}>
                    <div className={styles.items}>
                        <div className={styles.allContentAlignment}>
                            <div className={styles.text}>
                                <h2>
                                    Professional Fashion Photography Without Photoshoots
                                </h2>
                                <p>
                                    Glamolic AI helps clothing brands create studio-quality fashion photos in minutes. No photographers, no expensive studios, no complicated shoots just upload
                                    your product and generate stunning model images instantly.
                                </p>
                            </div>
                            <div className={styles.colGrid}>
                                <div className={styles.colGridItems}>
                                    <img src={CardImage1} alt='CardImage1' />
                                </div>
                                <div className={styles.colGridItems}>
                                    <img src={CardImage2} alt='CardImage2' />
                                </div>
                                <div className={styles.colGridItems}>
                                    <img src={CardImage3} alt='CardImage3' />
                                </div>
                                <div className={styles.colGridItems}>
                                    <img src={CardImage4} alt='CardImage4' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.items}>
                        <div className={styles.lightBox}>
                            <div className={styles.image}>
                                <img src={PhotoShootImage} alt='PhotoShootImage' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
