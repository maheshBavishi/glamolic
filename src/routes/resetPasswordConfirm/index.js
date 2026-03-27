"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CloseIcon from "@/icons/closeIcon";
import LockIcon from "@/icons/lockIcon";
import EyeIcon from "@/icons/eyeIcon";
import EyeOffIcon from "@/icons/eyeOffIcon";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import styles from "./resetPasswordConfirm.module.scss";

const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

function PasswordField({ id, label, placeholder, value, onChange, error, isVisible, onToggle, autoComplete }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.inputShell}>
        <span className={styles.leftIcon}>
          <LockIcon />
        </span>
        <input
          id={id}
          name={id}
          type={isVisible ? "password" : "text"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          spellCheck="false"
        />
        <button type="button" className={styles.toggleButton} onClick={onToggle} aria-label={isVisible ? `Hide ${label}` : `Show ${label}`}>
          {isVisible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      {error ? <p className={styles.errorText}>{error}</p> : null}
    </div>
  );
}

export default function ResetPasswordConfirm() {
  const router = useRouter();
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let isMounted = true;
    let redirectTimeout;

    const validateSession = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const type = hashParams.get("type");
        const accessToken = hashParams.get("access_token");

        console.log("URL type:", type);
        console.log("Has access token:", !!accessToken);

        await new Promise((resolve) => setTimeout(resolve, 500));

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        console.log("Session exists:", !!session);
        console.log("Session error:", error);

        if (!isMounted) return;

        if (error || !session) {
          toast.error("Invalid or expired reset link. Please request a new one.");
          redirectTimeout = window.setTimeout(() => {
            router.replace("/forgot-password");
          }, 2000);
          return;
        }

        setIsValidating(false);
      } catch (err) {
        if (!isMounted) return;
        console.error("Validation error:", err);
        toast.error("Something went wrong. Please try again.");
        redirectTimeout = window.setTimeout(() => {
          router.replace("/forgot-password");
        }, 2000);
      }
    };

    validateSession();

    return () => {
      isMounted = false;
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
    };
  }, [router]);

  const handleClose = () => {
    router.push("/login");
  };

  const validateForm = () => {
    const nextErrors = {};
    const passwordValue = password || "";
    const confirmPasswordValue = confirmPassword || "";
    if (!passwordValue.trim()) {
      nextErrors.password = "Please enter your new password!";
    } else if (!PASSWORD_REGEX.test(passwordValue)) {
      nextErrors.password =
        "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character!";
    }
    if (!confirmPasswordValue.trim()) {
      nextErrors.confirmPassword = "Please confirm your new password!";
    } else if (passwordValue !== confirmPasswordValue) {
      nextErrors.confirmPassword = "Passwords don't match";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const { error } = await updatePassword(password);
      if (error) {
        toast.error(error.message || "Unable to update password");
      } else {
        toast.success("Password updated successfully!");
        router.push("/");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className={styles.loginwrapper}>
        <div className={styles.modal}>
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <h2>Validating reset link</h2>
            <p>Please wait while we verify your recovery session.</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.loginwrapper}>
      <div className={styles.modal}>
        <button type="button" className={styles.closeIcon} onClick={handleClose} aria-label="Close reset password screen">
          <CloseIcon />
        </button>
        <div className={styles.text}>
          <h2>Set New Password</h2>
          <p>Enter your new password below</p>
        </div>
        <form onSubmit={handleSubmit}>
          <PasswordField
            id="password"
            label="New Password"
            placeholder="Enter new password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (errors.password) {
                setErrors((current) => ({ ...current, password: "" }));
              }
            }}
            error={errors.password}
            isVisible={!showPassword}
            onToggle={() => setShowPassword((current) => !current)}
            autoComplete="new-password"
          />
          <div className={styles.bottomSpacing}>
            <PasswordField
              id="confirmPassword"
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                if (errors.confirmPassword) {
                  setErrors((current) => ({ ...current, confirmPassword: "" }));
                }
              }}
              error={errors.confirmPassword}
              isVisible={!showConfirmPassword}
              onToggle={() => setShowConfirmPassword((current) => !current)}
              autoComplete="new-password"
            />
          </div>
          <div className={styles.buttonDesign}>
            <button type="submit" aria-label="Update Password" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
          <div className={styles.centertext}>
            <p>
              Remember your password? <Link href="/login">Sign in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
