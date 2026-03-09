import React from 'react'
import styles from './generatedImages.module.scss';
import Button from '@/components/button';
const StickIcon = '/assets/icons/stick.svg';
const PdfIcon = '/assets/icons/pdf.svg';
const DownloadIcon = '/assets/icons/download.svg';
const ReloadIcon = '/assets/icons/reload.svg';
const FillIcon = '/assets/icons/dwonload-fill.svg';
const VideoIcon = '/assets/icons/video.svg';
const DangerIcon = '/assets/icons/danger.svg';
const FinalImage = '/assets/images/final1.png';
export default function GeneratedImages() {
    return (
        <div className={styles.generatedImages}>
            <div className={styles.subboxHeaderAlignment}>
                <div className={styles.iconText}>
                    <img src={StickIcon} alt='StickIcon' />
                    <h3>
                        Generated Images
                    </h3>
                </div>
                <div className={styles.twoButtonAlignment}>
                    <Button text="Export PDF" icon={PdfIcon} />
                    <Button text="Download all" icon={DownloadIcon} />
                </div>
            </div>
            <div className={styles.imageGrid}>
                <div className={styles.items}>
                    <div className={styles.image}>
                        <img src={FinalImage} alt='FinalImage' />
                    </div>
                    <div className={styles.topAlignment}>
                        <img src={ReloadIcon} alt='ReloadIcon' />
                        <img src={FillIcon} alt='FillIcon' />
                    </div>
                    <div className={styles.centerAlignment}>
                        <Button text="Generate video" icon={VideoIcon} />
                    </div>
                </div>
                <div className={styles.items}>
                    <div className={styles.image}>
                        <img src={FinalImage} alt='FinalImage' />
                    </div>
                    <div className={styles.topAlignment}>
                        <img src={ReloadIcon} alt='ReloadIcon' />
                        <img src={FillIcon} alt='FillIcon' />
                    </div>
                    <div className={styles.centerAlignment}>
                        <Button text="Generate video" icon={VideoIcon} />
                    </div>
                </div>
                <div className={styles.items}>
                    <div className={styles.image}>
                        <img src={FinalImage} alt='FinalImage' />
                    </div>
                    <div className={styles.topAlignment}>
                        <img src={ReloadIcon} alt='ReloadIcon' />
                        <img src={FillIcon} alt='FillIcon' />
                    </div>
                    <div className={styles.centerAlignment}>
                        <Button text="Generate video" icon={VideoIcon} />
                    </div>
                </div>
            </div>
            <div className={styles.noteAlignment}>
                <div className={styles.note}>
                    <img src={DangerIcon} alt='DangerIcon' />
                    <p>
                        <span>Note: </span> Generated images will be automatically deleted from history after 3 day.
                    </p>
                </div>
            </div>
        </div>
    )
}
