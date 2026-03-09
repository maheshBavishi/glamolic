import React from 'react'
import styles from './categorySelection.module.scss';
import LeftIcon from '@/icons/leftIcon';
import RightWhiteIcon from '@/icons/rightWhiteIcon';
import Link from 'next/link';
const WomenImage = '/assets/images/women.png';
const MenImage = '/assets/images/men.png';
export default function CategorySelection() {
    return (
        <div className={styles.categorySelection}>
            <div className='container-md'>
                <div className={styles.boxCenteralignment}>
                    <div className={styles.boxHeaderAlignment}>
                        <h2>
                            Glamolic Selection
                        </h2>
                        <p>
                            Select a category to get started
                        </p>
                    </div>
                    <div className={styles.boxDesign}>
                        <div className={styles.grid}>
                            <div className={styles.griditems}>
                                <div className={styles.image}>
                                    <img src={WomenImage} alt='WomenImage' />
                                </div>
                                <div className={styles.details}>
                                    <h4>
                                        Women
                                    </h4>
                                    <ul>
                                        <li>Saree</li>
                                        <li> Lehengas</li>
                                        <li>Kurtis & More</li>
                                    </ul>
                                    <Link href="/women-collection">
                                        <button
                                            whileHover={{ scale: 1.05, x: 5 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Explore
                                            <RightWhiteIcon />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            <div className={styles.griditems}>
                                <div className={styles.image}>
                                    <img src={MenImage} alt='MenImage' />
                                </div>
                                <div className={styles.details}>
                                    <h4>
                                        men
                                    </h4>
                                    <ul>
                                        <li>Jackets</li>
                                        <li> Sherwanis</li>
                                        <li>Blazer & More</li>
                                    </ul>
                                    <button
                                        whileHover={{ scale: 1.05, x: 5 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Explore
                                        <RightWhiteIcon />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
