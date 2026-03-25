import React from 'react'
import styles from './blogBanner.module.scss';
import SearchIcon from '@/icons/searchIcon';
export default function BlogBanner() {
    return (
        <div className={styles.blogBanner}>
            <div className={styles.topAlignment}>
                <div className="container">
                    <div className={styles.grid}>
                        <div className={styles.griditems}>
                            <div className={styles.textstyle}>
                                <h1>
                                    Transforming Your Content into a Superpower
                                </h1>
                                <p>
                                    Stay updated on AI detection, humanize AI content, and
                                    plagiarism checking with insights from glamolic.com experts.
                                </p>
                                <div className={styles.inputsearch}>
                                    <input type="text" placeholder="Search" />
                                    <div className={styles.icon}>
                                        <SearchIcon />
                                    </div>
                                </div>
                                <div className={styles.buttonAlignment}>
                                    <button>AI Detection</button>
                                    <button>Humanize AI Content</button>
                                    <button>Plagiarism Checker</button>
                                </div>
                            </div>
                        </div>
                        <div className={styles.griditems}>
                            <div className={styles.image}>
                                <img src='https://aichecker.pro/assets/images/blog-img.png' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
