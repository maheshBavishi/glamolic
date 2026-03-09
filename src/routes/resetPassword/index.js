import React from 'react'
import styles from './resetPassword.module.scss';
import CloseIcon from '@/icons/closeIcon';
import Input from '@/components/input';
import Link from 'next/link';
const GoogleIcon = '/assets/icons/google.svg';
export default function ResetPassword() {
    return (
        <div className={styles.loginwrapper}>
            <div className={styles.modal}>
                {/* <div className={styles.closeIcon}>
                    <CloseIcon />
                </div> */}
                <div className={styles.text}>
                    <h2>
                        Reset Password
                    </h2>
                    <p>
                        Enter your email address and we'll send you a link to reset your password
                    </p>
                </div>
                <div>
                    <div className={styles.bottomSpacing}>
                        <Input label='Email' placeholder=' johnfrans@gmail.com' smallInput />
                    </div>

                    <div className={styles.buttonDesign}>
                        <Link href="/otp-screen">
                            <button aria-label='Sign In'>
                                Send Reset link
                            </button>
                        </Link>
                    </div>
                    <div className={styles.centertext}>
                        <p>
                            Remember your password?  <a>Sign in</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
