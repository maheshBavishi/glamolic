import React from 'react'
import styles from './blogInformation.module.scss';
import DateIcon from '@/icons/dateIcon';
const ProfileImage = '/assets/images/profile.png';
export default function BlogInformation() {
    return (
        <div>
            <div className={styles.blogInformation}>
                <div className='container-xs'>
                    <div className={styles.title}>
                        <h1>
                            How AI Photoshoots Are Replacing Traditional Fashion Photography
                        </h1>
                        <div className={styles.profilleDateAlignment}>
                            <div className={styles.profile}>
                                <img src={ProfileImage} alt='ProfileImage' />
                                <span>
                                    Nathan Porter
                                </span>
                            </div>
                            <div className={styles.date}>
                                <DateIcon />
                                <span>
                                    March 25, 2026
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.mainImage}>
                        <img src="https://cms.gamerge.ai/uploads/Compete_to_Earn_Sustainable_Game_Fi_with_Deflation_9d3ec4f336.jpeg" />
                    </div>
                </div>
            </div>
        </div>
    )
}
