"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./whatsappVerificationModal.module.scss";
import CloseIcon from "@/icons/closeIcon";
import WhatsAppIconNew from "@/icons/whatsAppIconNew";
import PhoneInput from "@/components/phoneInput";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import toast from "react-hot-toast";
import api from "@/utils/api";
import { useCreditsStore } from "@/hooks/useCreditsStore";

export default function WhatsAppVerificationModal({ isOpen, onClose, onVerified }) {
  const { profile, refreshProfile, session, user } = useAuth();
  const { fetchCredits } = useCreditsStore();
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [mounted, setMounted] = useState(false);

  const otpInputs = useRef([]);

  useEffect(() => {
    setMounted(true);
    if (profile?.phone) {
      setPhoneNumber(profile.phone);
    }
  }, [profile]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  useEffect(() => {
    if (isOpen && typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    } else if (typeof document !== "undefined") {
      document.body.style.overflow = "unset";
    }

    if (!isOpen) {
      // Reset state when modal closes
      const timer = setTimeout(() => {
        setStep(1);
        setOtp(["", "", "", "", "", ""]);
        setIsSubmitting(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    // Format phone number: digits only (no + or spaces)
    const formattedNumber = phoneNumber.replace(/\D/g, "");

    setIsSubmitting(true);
    try {
      const response = await api.post(
        "/whatsapp/send-otp",
        {
          whatsapp_number: formattedNumber,
        },
        {
          token: session?.access_token,
        }
      );

      if (response.data.status !== "success") {
        throw new Error(response.data.message || "Failed to send OTP");
      }

      toast.success("OTP sent to your WhatsApp!");
      setStep(2);
      setResendTimer(60);
      setOtp(["", "", "", "", "", ""]);
    } catch (error) {
      console.error("Error sending OTP:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to send OTP. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const handleVerifyOTP = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      toast.error("Please enter the full 6-digit OTP");
      return;
    }

    // Format phone number: digits only
    const formattedNumber = phoneNumber.replace(/\D/g, "");

    setIsSubmitting(true);
    try {
      const response = await api.post(
        "/whatsapp/verify-otp",
        {
          whatsapp_number: formattedNumber,
          otp_code: fullOtp,
        },
        {
          token: session?.access_token,
        }
      );

      if (response.data.status !== "success") {
        throw new Error(response.data.message || "Invalid OTP");
      }
      // await refreshProfile();
      if (user?.id) {
        await fetchCredits(user.id);
      }
      toast.success(response.data.message || "Account verified! Credits added successfully.");
      onVerified?.();
      onClose();
    } catch (error) {
      console.error("Error verifying OTP:", error);
      const errorMessage = error.response?.data?.message || error.message || "Invalid OTP. Please check and try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.modalOverlay}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
          onClick={onClose}
        >
          <motion.div
            className={styles.modalContent}
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={onClose}>
              <CloseIcon />
            </button>

            <div className={styles.header}>
              <div className={styles.iconWrapper}>
                <WhatsAppIconNew />
              </div>
              <h2>{step === 1 ? "Get Verified" : "Verify OTP"}</h2>
              <p>
                {step === 1
                  ? "Verify your account with WhatsApp to claim your free credits now!"
                  : `Enter the 6-digit code sent to +${phoneNumber} via WhatsApp`}
              </p>
            </div>

            {step === 1 ? (
              <div className={styles.formSection}>
                <div className={styles.rewardBadge}>
                  <div className={styles.rewardText}>
                    🎁 Claim <span>5 FREE Credits</span> instantly after verification!
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <PhoneInput
                    label="Phone Number"
                    value={phoneNumber}
                    onChange={(val) => setPhoneNumber(val)}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className={styles.buttonContainer}>
                  <button
                    className={styles.primary}
                    onClick={handleSendOTP}
                    disabled={isSubmitting || !phoneNumber}
                  >
                    {isSubmitting ? "Sending..." : "Send OTP via WhatsApp"}
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.otpSection}>
                <div className={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      ref={(el) => (otpInputs.current[index] = el)}
                      maxLength={1}
                    />
                  ))}
                </div>

                <div className={styles.resendText}>
                  Didn't receive the code?
                  <button
                    onClick={handleSendOTP}
                    disabled={resendTimer > 0 || isSubmitting}
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Now"}
                  </button>
                </div>

                <div className={styles.buttonContainer}>
                  <button
                    className={styles.primary}
                    onClick={handleVerifyOTP}
                    disabled={isSubmitting || otp.some((d) => !d)}
                  >
                    {isSubmitting ? "Verifying..." : "Claim Free Credits"}
                  </button>
                  <button
                    className={styles.secondary}
                    onClick={() => {
                      setStep(1);
                      setOtp(["", "", "", "", "", ""]);
                    }}
                    disabled={isSubmitting}
                  >
                    Change Phone Number
                  </button>
                </div>
              </div>
            )}

            <div className={styles.footer}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Your data is encrypted and secure
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
