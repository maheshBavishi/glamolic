import styles from './privacyPolicyBanner.module.scss';
export default function PrivacyPolicyBanner() {
    return (
        <div className={styles.privacyPolicyBanner}>
            <div className='container'>
                <div className={styles.bannerDesign}>
                    <div>
                        <h1>
                            Privacy Policy
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

