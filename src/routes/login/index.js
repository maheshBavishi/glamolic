"use client";
import GoogleLogin from "@/components/GoogleLogin";
import Input from "@/components/input";
import { useAuth } from "@/context/AuthContext";
import CloseIcon from "@/icons/closeIcon";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./login.module.scss";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const EMAIL_REGEX = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

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
    setFormData((prev) => ({ ...prev, [name]: value.trimStart() }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    let formIsValid = true;
    let newErrors = {};
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
    }
    setErrors(newErrors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { error } = await signIn(formData.email, formData.password);
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password");
        } else if (error.message.includes("Access has been removed")) {
          toast.error("Access has been removed from this account");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Successfully signed in!");
        router.push("/");
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
        <div className={styles.text}>
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.bottomSpacing}>
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder=" johnfrans@gmail.com"
              smallInput
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
          </div>
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder=" Enter your password"
            smallInput
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
          <div className={styles.forgotpassword}>
            <Link href="/reset-password">Forgot password?</Link>
          </div>
          <div className={styles.buttonDesign}>
            <button type="submit" aria-label="Sign In" disabled={loading}>
              {loading ? "Please wait..." : "Sign In"}
            </button>
          </div>
          <div className={styles.centertext}>
            <p>
              Don't have an account? <Link href="/signup">Sign up</Link>
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
