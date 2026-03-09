import React from 'react'
import styles from './brandSection.module.scss';
import UserIcon from '@/icons/userIcon';
import VideoIcon from '@/icons/videoIcon';
import FlashLgIcon from '@/icons/flashLgIcon';
export default function BrandSection() {
    return (
        <div className={styles.brandSection}>
            <div className='container'>
                <div className={styles.title}>
                    <h2>
                        Everything Your Brand Needs
                    </h2>
                </div>
                <div className={styles.grid}>
                    <div className={styles.items}>
                        <div className={styles.icon}>
                            <UserIcon />
                        </div>
                        <h3>
                            AI Model Photos
                        </h3>
                        <p>
                            Generate photorealistic model images wearing your clothing, no studio or
                            models needed.
                        </p>
                    </div>
                    <div className={styles.items}>
                        <div className={styles.icon}>
                            <VideoIcon />
                        </div>
                        <h3>
                            Fashion Videos
                        </h3>
                        <p>
                            Create dynamic fashion videos and lookbooks powered
                            by AI animation technology.
                        </p>
                    </div>
                    <div className={styles.items}>
                        <div className={styles.icon}>
                            <VideoIcon />
                        </div>
                        <h3>
                            Fashion Videos
                        </h3>
                        <p>
                            Create dynamic fashion videos and lookbooks powered
                            by AI animation technology.
                        </p>
                    </div>
                    <div className={styles.items}>
                        <div className={styles.icon}>
                            <FlashLgIcon />
                        </div>
                        <h3>
                            Instant Generation
                        </h3>
                        <p>
                            Get professional results in seconds, not days.
                            Scale your content production infinitely.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
