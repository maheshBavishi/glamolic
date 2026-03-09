import React from 'react'
import styles from './photoshootsSection.module.scss';
const PhotoShootImage = '/assets/images/photoshoot3.png';
const CardImage = '/assets/images/img01.png';
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
                                    <img src={CardImage} alt='CardImage' />
                                </div>
                                <div className={styles.colGridItems}>
                                    <img src={CardImage} alt='CardImage' />
                                </div>
                                <div className={styles.colGridItems}>
                                    <img src={CardImage} alt='CardImage' />
                                </div>
                                <div className={styles.colGridItems}>
                                    <img src={CardImage} alt='CardImage' />
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
