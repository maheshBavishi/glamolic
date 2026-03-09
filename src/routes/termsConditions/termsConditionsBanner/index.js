import React from 'react'
import styles from './termsConditionsBanner.module.scss';
export default function TermsConditionsBanner() {
    return (
        <div className={styles.privacyPolicyBanner}>
            <div className='container'>
                <div className={styles.bannerDesign}>
                    <div>
                        <h1>
                            Terms & Conditions
                        </h1>
                        <p>
                            Last Updated: January 2026
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
