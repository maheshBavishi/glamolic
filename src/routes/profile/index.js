"use client";
import React, { useState, useEffect } from "react";
import styles from "./profile.module.scss";
import LeftIcon from "@/icons/leftIcon";
import EditIcon from "@/icons/editIcon";
import ProfileIcon from "@/icons/profileIcon";
import Input from "@/components/input";
import SubscriptionIcon from "@/icons/subscriptionIcon";
import RightWhiteIcon from "@/icons/rightWhiteIcon";
import ActiveIcon from "@/icons/activeIcon";
import ClockIcon from "@/icons/clockIcon";
import { useAuth } from "@/context/AuthContext";
import { useCreditsStore } from "@/hooks/useCreditsStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const ProfileImage = "/assets/images/profile.png";

export default function Profile() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", phone: "" });
  const [formErrors, setFormErrors] = useState({});
  const { user, profile, loading, updateProfile } = useAuth();
  const { loading: creditsLoading, credits, fetchCredits } = useCreditsStore();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (profile) {
      setFormData({
        fullName: profile.name || "",
        phone: profile.phone || "",
      });
    }
  }, [user, loading, profile, router]);

  useEffect(() => {
    if (user?.id) {
      fetchCredits(user.id);
    }
  }, [user?.id, fetchCredits]);

  const handleUpdateProfile = async () => {
    const trimmedData = {
      fullName: formData.fullName.trimStart(),
      phone: formData.phone.trimStart(),
    };

    const errors = {};
    if (trimmedData.phone && trimmedData.phone.length !== 10) {
      errors.phone = "Phone number must be exactly 10 digits";
    }
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    try {
      const { error } = await updateProfile({
        name: trimmedData.fullName,
        phone: trimmedData.phone,
      });
      if (error) {
        toast.error("Failed to update profile");
        console.error(error);
      } else {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        setFormData(trimmedData);
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error(err);
    }
  };

  const displayName = profile?.name || "User";
  const displayEmail = user?.email || "";
  const displayCreatedAt = user?.created_at
    ? (() => {
        const d = new Date(user.created_at);
        return `${d.toLocaleString("en-US", { month: "short" })}, ${d.getFullYear()}`;
      })()
    : "Unknown";

  return (
    <div className={styles.profileAlignment}>
      <div className="container-md">
        <div className={styles.boxCenteralignment}>
          <div className={styles.boxHeaderAlignment}>
            <div>
              <h2>My Profile</h2>
              <p>Manage your account settings and preferences.</p>
            </div>
          </div>
          <div className={styles.profileInformation}>
            <div className={styles.profileheaderAlignment}>
              <div className={styles.profilegrid}>
                <div className={styles.profile}>
                  <div className={styles.image}>
                    <img src={ProfileImage} alt="ProfileImage" />
                  </div>
                  <div className={styles.edit} onClick={() => setIsEditing(!isEditing)}>
                    <EditIcon />
                  </div>
                </div>
                <div>
                  <h2>{displayName}</h2>
                  <a href={`mailto:${displayEmail}`}>{displayEmail}</a>
                </div>
              </div>
              <div className={styles.buttonUi}>
                <button>
                  Credits: <span>{creditsLoading ? "..." : (credits?.available_credits ?? profile?.tokens ?? 0)}</span>
                </button>
              </div>
            </div>
            <div className={styles.topAlignment}>
              <div className={styles.texticon}>
                <ProfileIcon />
                <h3>Personal Information</h3>
              </div>
              <div className={styles.twocol}>
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  disabled={!isEditing}
                  error={formErrors.fullName}
                />
                <Input
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                    setFormData({ ...formData, phone: val });
                    if (val.length === 10) {
                      setFormErrors((prev) => ({ ...prev, phone: "" }));
                    }
                  }}
                  disabled={!isEditing}
                  error={formErrors.phone}
                />
                <div className={styles.col}>
                  <Input label="Email Address" value={displayEmail} disabled={true} />
                </div>

                {isEditing && (
                  <div className={styles.col} style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({ fullName: profile?.name || "", phone: profile?.phone || "" });
                        setFormErrors({});
                      }}
                      style={{
                        padding: "10px 24px",
                        background: "transparent",
                        color: "#527475",
                        borderRadius: "100px",
                        border: "1px solid #527475",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      style={{
                        padding: "10px 24px",
                        background: "#527475",
                        color: "#fff",
                        borderRadius: "100px",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.topAlignment}>
              <div className={styles.texticon}>
                <SubscriptionIcon />
                <h3>Subscription & Plan</h3>
              </div>
              <div className={styles.lightbox}>
                <div className={styles.freeplan}>
                  <div>
                    <h4>Free Plan</h4>
                    <p>You are currently on the free tier.</p>
                  </div>
                  <div className={styles.buttonDesign}>
                    <button>
                      Upgrade to Pro
                      <RightWhiteIcon />
                    </button>
                  </div>
                </div>
                <div className={styles.listBox}>
                  <div className={styles.information}>
                    <div className={styles.icon}>
                      <ActiveIcon />
                    </div>
                    <div>
                      <p>Account Status</p>
                      <span>Active</span>
                    </div>
                  </div>
                  <div className={styles.information}>
                    <div className={styles.icon}>
                      <ClockIcon />
                    </div>
                    <div>
                      <p>Member Since</p>
                      <span>{displayCreatedAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
