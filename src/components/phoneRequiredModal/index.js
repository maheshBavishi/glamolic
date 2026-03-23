"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import CloseIcon from "@/icons/closeIcon";
import Input from "@/components/input";
import styles from "./phoneRequiredModal.module.scss";

export default function PhoneRequiredModal({ isOpen, initialPhone = "", onClose, onConfirm }) {
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isSubmittingRef = useRef(false);

  const normalizePhone = (value) =>
    String(value || "")
      .replace(/\D/g, "")
      .slice(0, 10);
  const isValidPhone = (value) => normalizePhone(value).length === 10;

  useEffect(() => {
    isSubmittingRef.current = isSubmitting;
  }, [isSubmitting]);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setPhoneInput(normalizePhone(initialPhone));
    setPhoneError("");
    setIsSubmitting(false);
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSubmittingRef.current) {
        onClose?.();
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, initialPhone, onClose]);

  if (!isOpen || !isMounted) {
    return null;
  }

  const handleInputChange = (event) => {
    setPhoneInput(normalizePhone(event.target.value));
    if (phoneError) {
      setPhoneError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const sanitizedPhone = normalizePhone(phoneInput);
    if (!isValidPhone(sanitizedPhone)) {
      setPhoneError("Please enter a valid 10-digit phone number");
      return;
    }
    if (typeof onConfirm !== "function") {
      setPhoneError("Unable to continue right now. Please try again.");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await onConfirm(sanitizedPhone);
      if (result?.error) {
        setPhoneError(result.error);
      }
    } catch (error) {
      setPhoneError("Unable to continue right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={styles.loginwrapper}
      onClick={() => {
        if (!isSubmitting) {
          onClose?.();
        }
      }}
    >
      <div
        className={styles.modal}
        onClick={(event) => {
          event.stopPropagation();
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="phone-modal-title"
      >
        <button type="button" className={styles.closeIcon} onClick={onClose} disabled={isSubmitting} aria-label="Close phone number modal">
          <CloseIcon />
        </button>

        <div className={styles.text}>
          <h2 id="phone-modal-title">Phone Number Required</h2>
          <p>Please provide your phone number to continue with the payment.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.bottomSpacing}>
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              inputMode="numeric"
              placeholder="Enter 10-digit phone number"
              smallInput
              value={phoneInput}
              onChange={handleInputChange}
              error={phoneError}
              maxLength={10}
              autoFocus
            />
          </div>

          <div className={styles.noticeBox}>Your phone number is required for payment processing and order confirmation.</div>

          <div className={styles.buttonDesign}>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Continue"}
            </button>
          </div>
        </form>

        <div className={styles.footnote}>Your information is secure and will not be shared with third parties.</div>
      </div>
    </div>
  );
}
