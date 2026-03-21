"use client";
import React, { useState } from "react";
import styles from "./contactUs.module.scss";
import Input from "@/components/input";
import SendIcon from "@/icons/sendIcon";
import EmailIcon from "@/icons/emailIcon";
import CallIcon from "@/icons/callIcon";
import WhatsappIcon from "@/icons/whatsappIcon";
import LocationIcon from "@/icons/locationIcon";
import toast from "react-hot-toast";
import { supabase } from "@/integrations/supabase/client";

const EMAIL_REGEX = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const PHONE_REGEX = /^(?=(?:\D*\d){10,})[0-9+\s-]+$/;

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = name === "phone" ? value.replace(/[^0-9+\s-]/g, "") : value;

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    let isFormValid = true;
    let newErrors = {};
    const name = formData?.name?.trim() || "";
    const message = formData?.message?.trim() || "";
    const email = formData?.email?.trim() || "";
    const phone = formData?.phone?.trim() || "";
    if (!name) {
      isFormValid = false;
      newErrors.name = "Please enter fullName";
    }
    if (!message) {
      isFormValid = false;
      newErrors.message = "Please enter message";
    }
    if (!email) {
      isFormValid = false;
      newErrors.email = "Please enter email";
    } else if (!email.match(EMAIL_REGEX)) {
      isFormValid = false;
      newErrors.email = "Please enter a valid email address!";
    }
    if (!phone) {
      isFormValid = false;
      newErrors.phone = "Please enter phone number";
    } else if (!phone.match(PHONE_REGEX)) {
      isFormValid = false;
      newErrors.phone = "Please enter a valid phone number!";
    }
    setErrors(newErrors);
    return isFormValid;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("contact_messages").insert([
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
        },
      ]);
      if (error) {
        throw error;
      }
      toast.success("Message sent successfully!");
      resetForm();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactClick = (type, value) => {
    if (typeof window === "undefined") {
      return;
    }
    switch (type) {
      case "email":
        window.location.href = `mailto:${value}`;
        break;
      case "phone":
        window.location.href = `tel:${value.replace(/\s+/g, "")}`;
        break;
      case "whatsapp":
        window.open(`https://wa.me/${value.replace(/\s+/g, "")}`, "_blank");
        break;
      case "address":
        window.open(`https://www.google.com/maps/place/${encodeURIComponent(value)}`, "_blank");
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.contactUsAlignment}>
      <div className="container-md">
        <div className={styles.boxCenteralignment}>
          <div className={styles.boxHeaderAlignment}>
            <div>
              <h2>Contact Us</h2>
              <p>Have questions, feedback, or need support? fill out the form below or reach us through</p>
            </div>
          </div>
          <div className={styles.contactInformation}>
            <div className={styles.title}>
              <h3>Send us a message</h3>
            </div>
            <form className={styles.formAlignment} onSubmit={handleSubmit}>
              <div className={styles.twocol}>
                <Input label="Full Name" placeholder="Your name" name="name" value={formData.name} onChange={handleChange} error={errors.name} />
                <Input
                  label="Phone Number"
                  placeholder="Your number"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9+\\s-]*"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                />
                <div className={styles.collg}>
                  <Input
                    label="Email Address"
                    placeholder="Your email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                  />
                </div>
              </div>
              <div className={styles.textareaDesign}>
                <label>Message</label>
                <textarea name="message" placeholder="Your Message..." value={formData.message} onChange={handleChange}></textarea>
                {errors.message ? <p style={{ color: "red", fontSize: "14px", marginTop: "4px" }}>{errors.message}</p> : null}
              </div>
              <div className={styles.sendMessage}>
                <button type="submit" disabled={isSubmitting}>
                  Send Message
                  <SendIcon />
                </button>
              </div>
            </form>
            <div className={styles.information}>
              <div className={styles.items}>
                <div className={styles.icon}>
                  <EmailIcon />
                </div>
                <div>
                  <p>Email</p>
                  <a onClick={() => handleContactClick("email", "support@glamolic.com")}>support@glamolic.com</a>
                </div>
              </div>
              <div className={styles.items}>
                <div className={styles.icon}>
                  <CallIcon />
                </div>
                <div>
                  <p>Phone</p>
                  <a onClick={() => handleContactClick("phone", "+91 820 005 8875")}>+91 820 005 8875</a>
                </div>
              </div>
              <div className={styles.items}>
                <div className={styles.icon}>
                  <WhatsappIcon />
                </div>
                <div>
                  <p>Whatsapp</p>
                  <a onClick={() => handleContactClick("whatsapp", "+91 820 005 8875")}>+91 820 005 8875</a>
                </div>
              </div>
              <div className={styles.items}>
                <div className={styles.icon}>
                  <LocationIcon />
                </div>
                <div>
                  <p>Address</p>
                  <a onClick={() => handleContactClick("address", "Surat, Gujarat")}>Surat, Gujarat</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
