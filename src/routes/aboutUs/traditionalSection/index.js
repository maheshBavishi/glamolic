import React from 'react'
import styles from './traditionalSection.module.scss';
const Icon1 = '/assets/icons/icon1.svg';
const Icon2 = '/assets/icons/icon2.svg';
const Icon3 = '/assets/icons/icon3.svg';
const Icon4 = '/assets/icons/icon4.svg';
const Icon5 = '/assets/icons/icon5.svg';
const Icon6 = '/assets/icons/icon6.svg';
export default function TraditionalSection() {
    return (
        <div className={styles.traditionalSection}>
            <div className='container'>
                <div className={styles.title}>
                    <h2>
                        Traditional VS Glamolic AI
                    </h2>
                </div>
                <div className={styles.grid}>
                    <div className={styles.griditems}>
                        <img src={Icon1} alt='Icon1' />
                        <h3>
                            Realistic AI Models
                        </h3>
                        <p>
                            Generate stunningly realistic images of diverse AI models, ensuring they are entirely
                            indistinguishable from real photography.
                        </p>
                    </div>
                    <div className={styles.griditems}>
                        <img src={Icon2} alt='Icon2' />
                        <h3>
                            Every Fashion Category
                        </h3>
                        <p>
                            From everyday essentials and streetwear to haute couture and everything in between, our solution caters to all fashion categories.
                        </p>
                    </div>
                    <div className={styles.griditems}>
                        <img src={Icon3} alt='Icon3' />
                        <h3>
                            Speed & Scale
                        </h3>
                        <p>
                            Generate thousands of high-quality images per day, accelerating your content creation and keeping pace with dynamic market demands
                        </p>
                    </div>
                    <div className={styles.griditems}>
                        <img src={Icon4} alt='Icon4' />
                        <h3>
                            Affordable Plans
                        </h3>
                        <p>
                            Access premium content generation features with our cost-effective subscription plans, providing exceptional value compared to traditional methods.
                        </p>
                    </div>
                    <div className={styles.griditems}>
                        <img src={Icon5} alt='Icon5' />
                        <h3>
                            Brand Consistency
                        </h3>
                        <p>
                            Effectively maintain your brand's unique visual identity and aesthetic across every generated asset.
                        </p>
                    </div>
                    <div className={styles.griditems}>
                        <img src={Icon6} alt='Icon6' />
                        <h3>
                            Creative Control
                        </h3>
                        <p>
                            Adjust lighting, mood, and atmosphere to ensure the background perfectly complements your fashion collection.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
