import React from 'react'
import styles from './uploadPhoto.module.scss';
const CameraImage = '/assets/images/camera.png';
export default function UploadPhoto() {
    return (
        <div className={styles.uploadPhoto}>
            <div>
                <div className={styles.iconCenter}>
                    <img src={CameraImage} alt='CameraImage' />
                </div>
                <h4>
                    Upload photo
                </h4>
                <p>
                    Drag & drop or click to select a file
                </p>
                <p>
                    JPG, PNG, WebP (Max 7MB)
                </p>
            </div>
        </div>
    )
}
