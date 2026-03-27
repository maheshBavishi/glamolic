"use client";
import GoogleLogin from "@/components/GoogleLogin";
import Input from "@/components/input";
import { useAuth } from "@/context/AuthContext";
import CloseIcon from "@/icons/closeIcon";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import styles from "./signup.module.scss";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, user } = useAuth();
  const EMAIL_REGEX = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleClose = () => {
    router.back();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === "phone") {
      processedValue = value.replace(/[^0-9]/g, "");
      processedValue = processedValue.slice(0, 10);
    } else {
      processedValue = value.trimStart();
    }
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    let formIsValid = true;
    let newErrors = {};

    if (!formData?.fullName || formData?.fullName?.trim() === "") {
      formIsValid = false;
      newErrors["fullName"] = "Please enter your full name!";
    }
    if (!formData?.phone || formData?.phone?.trim() === "") {
      formIsValid = false;
      newErrors["phone"] = "Please enter your phone number!";
    } else if (formData?.phone?.length < 10) {
      formIsValid = false;
      newErrors["phone"] = "Phone number must be at least 10 digits!";
    }
    if (!formData?.email || formData?.email?.trim() === "") {
      formIsValid = false;
      newErrors["email"] = "Please enter your email!";
    } else if (!EMAIL_REGEX.test(formData?.email)) {
      formIsValid = false;
      newErrors["email"] = "Please enter valid email!";
    }
    if (!formData?.password || formData?.password?.trim() === "") {
      formIsValid = false;
      newErrors["password"] = "Please enter your password!";
    } else if (!PASSWORD_REGEX.test(formData?.password)) {
      formIsValid = false;
      newErrors["password"] =
        "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character!";
    }
    setErrors(newErrors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { error, data } = await signUp(formData.email, formData.password, formData.fullName, formData.phone);
      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("This email is already registered. Please sign in.");
        } else {
          toast.error(error.message);
        }
      } else {
        if (data?.user && !data?.session) {
          setEmailSent(true);
          toast.success("Please check your email to confirm your account!");
        } else if (data?.session) {
          toast.error("⚠️ Email confirmation is disabled in Supabase. Please enable it in Authentication > Providers > Email settings.");
          router.push("/");
        } else {
          toast.success("Account created successfully!");
          router.push("/");
        }
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className={styles.loginwrapper}>
        <div className={styles.modal}>
          <div className={styles.text}>
            <h2>Check Your Email</h2>
            <p>We've sent a confirmation link to {formData.email}</p>
            <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--muted-foreground)" }}>
              Click the link in the email to confirm your account and start using GlamolicAI.
            </p>
          </div>
          <div className={styles.buttonDesign} style={{ marginTop: "2rem" }}>
            <button
              onClick={() => {
                setEmailSent(false);
                setFormData({ fullName: "", email: "", phone: "", password: "" });
              }}
            >
              Back to Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.loginwrapper}>
      <div className={styles.modal}>
        <div className={styles.closeIcon} onClick={handleClose}>
          <CloseIcon />
        </div>
        <div className={styles.text}>
          <h2>Create Account</h2>
          <p>Join us to get started</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.bottomSpacing}>
            <Input
              label="Full Name"
              name="fullName"
              placeholder="Enter your full name"
              smallInput
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />
          </div>
          <div className={styles.bottomSpacing}>
            <Input
              label="Phone Number"
              name="phone"
              placeholder="Enter your number"
              smallInput
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
            />
          </div>
          <div className={styles.bottomSpacing}>
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              smallInput
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
          </div>
          <div className={styles.bottomSpacing}>
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              smallInput
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              showPasswordToggle
              isPasswordVisible={showPassword}
              onTogglePassword={() => setShowPassword((current) => !current)}
              autoComplete="new-password"
            />
          </div>
          <div className={styles.buttonDesign}>
            <button type="submit" aria-label="Sign up" disabled={loading}>
              {loading ? "Please wait..." : "Sign up"}
            </button>
          </div>
          <div className={styles.centertext}>
            <p>
              Don't have an account? <Link href="/login"> Sign in</Link>
            </p>
          </div>
          <div className={styles.orlineGrid}>
            <div className={styles.line}></div>
            <span>Or</span>
            <div className={styles.line}></div>
          </div>
          <GoogleLogin className={styles.googleLogin} />
        </form>
      </div>
    </div>
  );
}
