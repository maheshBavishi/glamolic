"use client";
import CloseIcon from "@/icons/closeIcon";
import Input from "@/components/input";
const GoogleIcon = "/assets/icons/google.svg";
import styles from "./otpScreen.module.scss";
import { useRouter } from "next/navigation";
export default function OtpScreen() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };
  return (
    <div className={styles.loginwrapper}>
      <div className={styles.modal}>
        <div className={styles.closeIcon} onClick={handleClose}>
          <CloseIcon />
        </div>
        <div className={styles.text}>
          <h2>OTP Verification Code</h2>
          <p>Code has been send to*****123456</p>
        </div>
        <div>
          <div className={styles.inputAlignment}>
            <input type="text" />
            <input type="text" />
            <input type="text" />
            <input type="text" />
            <input type="text" />
            <input type="text" />
          </div>
          <div className={styles.centertext}>
            <p>
              Didn’t get the OTP <a>Resend</a>
            </p>
          </div>
          <div className={styles.buttonDesign}>
            <button aria-label="Verify">Verify</button>
          </div>
        </div>
      </div>
    </div>
  );
}
