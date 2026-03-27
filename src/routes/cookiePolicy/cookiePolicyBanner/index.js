import styles from "./cookiePolicyBanner.module.scss";

export default function CookiePolicyBanner() {
  return (
    <div className={styles.cookiePolicyBanner}>
      <div className="container">
        <div className={styles.bannerDesign}>
          <div>
            <h1>Cookie Policy</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
