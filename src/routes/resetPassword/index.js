"use client";
import Input from "@/components/input";
import { useAuth } from "@/context/AuthContext";
import CloseIcon from "@/icons/closeIcon";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import styles from "./resetPassword.module.scss";

export default function ResetPassword() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const EMAIL_REGEX = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  const handleClose = () => {
    router.back();
  };

  const validate = () => {
    let formIsValid = true;
    let newError = "";
    if (!email || email.trim() === "") {
      formIsValid = false;
      newError = "Please enter your email!";
    } else if (!EMAIL_REGEX.test(email)) {
      formIsValid = false;
      newError = "Please enter valid email!";
    }
    setError(newError);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { error: resetError } = await resetPassword(email);
      if (resetError) {
        toast.error(resetError.message);
      } else {
        setEmailSent(true);
        toast.success("Password reset email sent! Check your inbox.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginwrapper}>
      <div className={styles.modal}>
        <div className={styles.closeIcon} onClick={handleClose}>
          <CloseIcon />
        </div>
        {!emailSent ? (
          <>
            <div className={styles.text}>
              <h2>Forgot Password</h2>
              <p>Enter your email address and we'll send you a link to reset your password</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles.bottomSpacing}>
                <Input
                  label="Email"
                  placeholder=" Enter your email"
                  smallInput
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value.trimStart());
                    setError("");
                  }}
                  error={error}
                />
              </div>
              <div className={styles.buttonDesign}>
                <button type="submit" aria-label="Send Reset link" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset link"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className={styles.successView}>
            <div className={styles.iconContainer}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"></path>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                <path d="m16 19 2 2 4-4"></path>
              </svg>
            </div>
            <h2>Check Your Email</h2>
            <p className={styles.subtitle}>
              We've sent a password reset link to
              <br />
              <span className={styles.emailText}>{email}</span>
            </p>
            <p className={styles.instruction}>Didn't receive the email? Check your spam folder or try again.</p>
            <div className={styles.actionButton}>
              <button type="button" onClick={() => setEmailSent(false)}>
                Try Another Email
              </button>
            </div>
          </div>
        )}
        <div className={styles.centertext} style={{ marginTop: "24px" }}>
          <p>
            Remember your password? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
