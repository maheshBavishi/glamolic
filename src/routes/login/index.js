import React from 'react'
import styles from './login.module.scss';
import CloseIcon from '@/icons/closeIcon';
import Input from '@/components/input';
import Link from 'next/link';
const GoogleIcon = '/assets/icons/google.svg';
export default function Login() {
    return (
        <div className={styles.loginwrapper}>
            <div className={styles.modal}>
                <div className={styles.closeIcon}>
                    <CloseIcon />
                </div>
                <div className={styles.text}>
                    <h2>
                        Welcome Back
                    </h2>
                    <p>
                        Sign in to your account
                    </p>
                </div>
                <div>
                    <div className={styles.bottomSpacing}>
                        <Input label='Email' placeholder=' johnfrans@gmail.com' smallInput />
                    </div>
                    <Input label='Password' placeholder=' Enter your password' smallInput />
                    <div className={styles.forgotpassword}>
                        <Link href="/reset-password">
                            Forgot password?
                        </Link>
                    </div>
                    <div className={styles.buttonDesign}>
                        <Link href="/category-selection">
                            <button aria-label='Sign In'>
                                Sign In
                            </button>
                        </Link>
                    </div>
                    <div className={styles.centertext}>
                        <p>
                            Don't have an account? <Link href="/signup">Sign up</Link>
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
