import React from 'react'
import styles from './contactUs.module.scss';
import Input from '@/components/input';
import SendIcon from '@/icons/sendIcon';
import EmailIcon from '@/icons/emailIcon';
import CallIcon from '@/icons/callIcon';
import WhatsappIcon from '@/icons/whatsappIcon';
import LocationIcon from '@/icons/locationIcon';
export default function ContactUs() {
    return (
        <div className={styles.contactUsAlignment}>
            <div className='container-md'>
                <div className={styles.boxCenteralignment}>
                    <div className={styles.boxHeaderAlignment}>
                        <div>
                            <h2>
                                Contact Us
                            </h2>
                            <p>
                                Have questions, feedback, or need support? fill out the form below or reach us through
                            </p>
                        </div>
                    </div>
                    <div className={styles.contactInformation}>
                        <div className={styles.title}>
                            <h3>
                                Send us a message
                            </h3>
                        </div>
                        <div className={styles.formAlignment}>
                            <div className={styles.twocol}>
                                <Input label='Full Name' placeholder='Your name' />
                                <Input label='Phone Number' placeholder='Your number' />
                                <div className={styles.collg}>
                                    <Input label='Email Address' placeholder='Your email' />
                                </div>
                            </div>
                            <div className={styles.textareaDesign}>
                                <label>
                                    Message
                                </label>
                                <textarea placeholder='Your Message...'></textarea>
                            </div>
                            <div className={styles.sendMessage}>
                                <button>
                                    Send Message
                                    <SendIcon />
                                </button>
                            </div>
                        </div>
                        <div className={styles.information}>
                            <div className={styles.items}>
                                <div className={styles.icon}>
                                    <EmailIcon />
                                </div>
                                <div>
                                    <p>
                                        Email
                                    </p>
                                    <a>
                                        support@glamolic.com
                                    </a>
                                </div>
                            </div>
                            <div className={styles.items}>
                                <div className={styles.icon}>
                                    <CallIcon />
                                </div>
                                <div>
                                    <p>
                                        Phone
                                    </p>
                                    <a>
                                        +91 820 005 8875
                                    </a>
                                </div>
                            </div>
                            <div className={styles.items}>
                                <div className={styles.icon}>
                                    <WhatsappIcon />
                                </div>
                                <div>
                                    <p>
                                        Whatsapp
                                    </p>
                                    <a>
                                        +91 820 005 8875
                                    </a>
                                </div>
                            </div>
                            <div className={styles.items}>
                                <div className={styles.icon}>
                                    <LocationIcon />
                                </div>
                                <div>
                                    <p>
                                        Address
                                    </p>
                                    <a>
                                        Surat, Gujarat
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
