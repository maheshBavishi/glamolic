import React from 'react'
import styles from './tableOfContentDetails.module.scss';
export default function TableOfContentDetails() {
    return (
        <div className={styles.tableOfContentDetails}>
            <div className='container-xs'>
                <div className={styles.grid}>
                    <div className={styles.griditems}>
                        <div className={styles.tableofContent}>
                            <h2>Table of Contents</h2>
                            <span>
                                The Evolution of AI Writing Models
                            </span>
                            <span>
                                Meet the Contenders: Model Overview

                            </span>
                            <span>
                                Claude Opus 4.6
                            </span>
                            <span>
                                Gemini 3 Pro
                            </span>
                            <span>
                                GPT-5
                            </span>
                            <span>
                                The Benchmark Battle: Performance Analysis
                            </span>
                            <span>
                                Creativity and Nuance
                            </span>
                            <span>
                                Factual Accuracy and Reasoning
                            </span>
                            <span>
                                Coding and Technical Tasks
                            </span>
                            <span>
                                User Experience and Accessibility
                            </span>
                            <span>
                                Pricing and Availability
                            </span>
                            <span>
                                The Verdict: Which Model Reigns Supreme?
                            </span>
                            <span>
                                Final Thoughts
                            </span>
                        </div>
                    </div>
                    <div className={styles.griditems}></div>
                </div>
            </div>
        </div>
    )
}
