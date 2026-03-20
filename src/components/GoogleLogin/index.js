"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
const GoogleIcon = "/assets/icons/google.svg";

export default function GoogleLogin({ className }) {
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      const { error: signInError } = await signInWithGoogle();
      if (signInError) {
        setError(signInError.message || "Failed to sign in with Google");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className={className}>
      <button onClick={handleGoogleSignIn} type="button">
        <img src={GoogleIcon} alt="GoogleIcon" />
        Continue with Google
      </button>
      {error && <p style={{ color: "red", fontSize: "14px", marginTop: "8px", textAlign: "center" }}>{error}</p>}
    </div>
  );
}
