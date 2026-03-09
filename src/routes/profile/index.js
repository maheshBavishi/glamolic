import React from 'react'
import styles from './profile.module.scss';
import LeftIcon from '@/icons/leftIcon';
import EditIcon from '@/icons/editIcon';
import ProfileIcon from '@/icons/profileIcon';
import Input from '@/components/input';
import SubscriptionIcon from '@/icons/subscriptionIcon';
import RightWhiteIcon from '@/icons/rightWhiteIcon';
import ActiveIcon from '@/icons/activeIcon';
import ClockIcon from '@/icons/clockIcon';
const ProfileImage = '/assets/images/profile.png';
export default function Profile() {
    return (
        <div className={styles.profileAlignment}>
            <div className='container-md'>
                <div className={styles.boxCenteralignment}>
                    <div className={styles.boxHeaderAlignment}>
                        <div>
                            <h2>
                                My Profile
                            </h2>
                            <p>
                                Manage your account settings and preferences.
                            </p>
                        </div>
                    </div>
                    <div className={styles.profileInformation}>
                        <div className={styles.profileheaderAlignment}>
                            <div className={styles.profilegrid}>
                                <div className={styles.profile}>
                                    <div className={styles.image}>
                                        <img src={ProfileImage} alt='ProfileImage' />
                                    </div>
                                    <div className={styles.edit}>
                                        <EditIcon />
                                    </div>
                                </div>
                                <div>
                                    <h2>
                                        Mitali Dhameliya
                                    </h2>
                                    <a href='mailto:mitali381.rejoice@gmail.com'>
                                        mitali381.rejoice@gmail.com
                                    </a>
                                </div>
                            </div>
                            <div className={styles.buttonUi}>
                                <button>
                                    Credits: <span>2</span>
                                </button>
                            </div>
                        </div>
                        <div className={styles.topAlignment}>
                            <div className={styles.texticon}>
                                <ProfileIcon />
                                <h3>
                                    Personal Information
                                </h3>
                            </div>
                            <div className={styles.twocol}>
                                <Input label='Full Name' placeholder='Mitali Dhameliya' />
                                <Input label='Phone Number' placeholder='N/A' />
                                <div className={styles.col}>
                                    <Input label='Email Address' placeholder='mitali381.rejoice@gmail.com' />
                                </div>
                            </div>
                        </div>
                        <div className={styles.topAlignment}>
                            <div className={styles.texticon}>
                                <SubscriptionIcon />
                                <h3>
                                    Subscription & Plan
                                </h3>
                            </div>
                            <div className={styles.lightbox}>
                                <div className={styles.freeplan}>
                                    <div>
                                        <h4>
                                            Free Plan
                                        </h4>
                                        <p>
                                            You are currently on the free tier.
                                        </p>
                                    </div>
                                    <div className={styles.buttonDesign}>
                                        <button>
                                            Upgrade to Pro
                                            <RightWhiteIcon />
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.listBox}>
                                    <div className={styles.information}>
                                        <div className={styles.icon}>
                                            <ActiveIcon />
                                        </div>
                                        <div>
                                            <p>
                                                Account Status
                                            </p>
                                            <span>
                                                Active
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.information}>
                                        <div className={styles.icon}>
                                            <ClockIcon />
                                        </div>
                                        <div>
                                            <p>
                                                Member Since
                                            </p>
                                            <span>
                                                Feb,2026
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
