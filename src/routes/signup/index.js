import React from 'react'
import styles from './signup.module.scss';
import CloseIcon from '@/icons/closeIcon';
import Input from '@/components/input';
const GoogleIcon = '/assets/icons/google.svg';
export default function Signup() {
    return (
        <div className={styles.loginwrapper}>
            <div className={styles.modal}>
                <div className={styles.closeIcon}>
                    <CloseIcon />
                </div>
                <div className={styles.text}>
                    <h2>
                        Create Account
                    </h2>
                    <p>
                        Join us to get started
                    </p>
                </div>
                <div>
                    <div className={styles.bottomSpacing}>
                        <Input label='Full Name' placeholder='  john frans' smallInput />
                    </div>
                    <div className={styles.bottomSpacing}>
                        <Input label='Phone Number' placeholder='Enter your number' smallInput />
                    </div>
                    <div className={styles.bottomSpacing}>
                        <Input label='Email' placeholder=' johnfrans@gmail.com' smallInput />
                    </div>
                    <div className={styles.bottomSpacing}>
                        <Input label='Password' placeholder='Enter your password' smallInput />
                    </div>
                    <div className={styles.buttonDesign}>
                        <button aria-label='Sign up'>
                            Sign up
                        </button>
                    </div>
                    <div className={styles.centertext}>
                        <p>
                            Don't have an account? <a> Sign in</a>
                        </p>
                    </div>
                    <div className={styles.orlineGrid}>
                        <div className={styles.line}></div>
                        <span>Or</span>
                        <div className={styles.line}></div>
                    </div>
                    <div className={styles.googleLogin}>
                        <button>
                            <img src={GoogleIcon} alt='GoogleIcon' />
                            Continue with Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
