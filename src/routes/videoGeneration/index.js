import React from 'react'
import styles from './videoGeneration.module.scss';
import UploadPhoto from '@/components/uploadPhoto';
import BottomIcon from '@/icons/bottomIcon';
import BottomRightIcon from '@/icons/bottomRightIcon';
import CenterIcon from '@/icons/centerIcon';
import TopRightIcon from '@/icons/topRightIcon';
import TopLeftIcon from '@/icons/topLeftIcon';
import Dropdown from '@/components/dropdown';
import MobileIcon from '@/icons/mobileIcon';
import LandscapeIcon from '@/icons/landscapeIcon';
import Switch from '@/components/switch';
import ShopIcon from '@/icons/shopIcon';
import CameraIcon from '@/icons/cameraIcon';
import RightWhiteIcon from '@/icons/rightWhiteIcon';
const VideoImage = '/assets/images/video-img.png';
const LineIcon = '/assets/icons/line.svg';

export default function VideoGeneration() {
    return (
        <div className={styles.videoGeneration}>
            <div className='container-md'>
                <div className={styles.boxCenteralignment}>
                    <div className={styles.boxHeaderAlignment}>
                        <div>
                            <h2>
                                Configure your Video generation
                            </h2>
                            <p>
                                Tansform your static image into a dynamic video with AI.customize
                                your settings below.
                            </p>
                        </div>
                    </div>
                    <div className={styles.mainBoxDesign}>
                        <div className={styles.subbox}>
                            <div className={styles.maingrid}>
                                <div className={styles.image}>
                                    <img src={VideoImage} alt='VideoImage' />
                                </div>
                                <div>
                                    <div className={styles.textareaDesign}>
                                        <label>
                                            Video prompt
                                        </label>
                                        <textarea>
                                            Summer floral dress
                                        </textarea>
                                    </div>
                                    <div className={styles.uploadText}>
                                        <label>Logo</label>
                                    </div>
                                    <UploadPhoto />
                                </div>
                            </div>
                            <div className={styles.logoposition}>
                                <p>Logo position
                                </p>
                                <div className={styles.logogrid}>
                                    <div className={styles.items}>
                                        <BottomIcon />
                                        <span>
                                            Bottom left
                                        </span>
                                    </div>
                                    <div className={styles.items}>
                                        <BottomRightIcon />
                                        <span>
                                            Bottom right
                                        </span>
                                    </div>
                                    <div className={styles.items}>
                                        <CenterIcon />
                                        <span>
                                            Center
                                        </span>
                                    </div>
                                    <div className={styles.items}>
                                        <TopRightIcon />
                                        <span>
                                            Top Right
                                        </span>
                                    </div>
                                    <div className={styles.items}>
                                        <TopLeftIcon />
                                        <span>
                                            Top left
                                        </span>
                                    </div>

                                </div>
                            </div>
                            <div className={styles.logosize}>
                                <p>
                                    Logo size
                                </p>
                                <div className={styles.threeCol}>
                                    <input type='text' placeholder='small' />
                                    <input type='text' placeholder='Medium' />
                                    <input type='text' placeholder='Large' />
                                </div>
                            </div>
                            <div className={styles.topbottomAlignment}>
                                <Dropdown label='Duration' placeholder='10 seconds' />
                            </div>
                            <div className={styles.ratio}>
                                <p>
                                    Aspect ratio
                                </p>
                                <div className={styles.twocol}>
                                    <div className={styles.items}>
                                        <MobileIcon />
                                        <span>
                                            Portrait (9:16)
                                        </span>
                                    </div>
                                    <div className={styles.items}>
                                        <LandscapeIcon />
                                        <span>
                                            Landscape (16:09)
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.audiotype}>
                                <p>
                                    Audio type
                                </p>
                                <div className={styles.three}>
                                    <div className={styles.items}>
                                        <span>
                                            None
                                        </span>
                                    </div>
                                    <div className={styles.items}>
                                        <span>
                                            Instrumental
                                        </span>
                                    </div>
                                    <div className={styles.items}>
                                        <span>
                                            Voice over
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.duration}>
                                <h6>
                                    Duration
                                </h6>
                                <div className={styles.subbox}>
                                    <div className={styles.items}>
                                        <div className={styles.icontext}>
                                            <div className={styles.icon}>
                                                <CameraIcon />
                                            </div>
                                            <div>
                                                <h5>
                                                    Show product name
                                                </h5>
                                                <p>
                                                    Display the product name as a text overlay on the video
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <Switch />
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className={styles.estimateBox}>
                                <div className={styles.contentAlignment}>
                                    <div className={styles.leftAlignment}>
                                        <p>
                                            Estimated Cost
                                        </p>
                                        <button>
                                            4 credits
                                        </button>
                                    </div>
                                    <div className={styles.line}>
                                        <img src={LineIcon} alt='LineIcon' />
                                    </div>
                                    <div className={styles.leftAlignment}>
                                        <p>
                                            Available Balance
                                        </p>
                                        <button>
                                            2 credits
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.buttonDesign}>
                                    <button>
                                        Upgrade to Pro
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
