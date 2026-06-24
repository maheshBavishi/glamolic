"use client";
import Input from "@/components/input";
import { useAuth } from "@/context/AuthContext";
import { useCreditsStore } from "@/hooks/useCreditsStore";
import ActiveIcon from "@/icons/activeIcon";
import ClockIcon from "@/icons/clockIcon";
import EditIcon from "@/icons/editIcon";
import ProfileIcon from "@/icons/profileIcon";
import RightWhiteIcon from "@/icons/rightWhiteIcon";
import SubscriptionIcon from "@/icons/subscriptionIcon";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import styles from "./profile.module.scss";
import { useImageUpload } from "@/hooks/useImageUpload";

const ProfileImage = "/assets/images/profile.png";

export default function Profile() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", phone: "" });
  const [formErrors, setFormErrors] = useState({});
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const { user, profile, loading, updateProfile, userTransactions } = useAuth();
  const { loading: creditsLoading, credits, fetchCredits } = useCreditsStore();
  const { uploadImage, isUploading } = useImageUpload();

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file, user.id, "brand-logos", "branding-assets");
      const { error } = await updateProfile({ brand_logo_url: url });
      if (error) {
        toast.error("Failed to update logo");
      } else {
        toast.success("Logo updated successfully");
      }
    } catch (err) {
      toast.error(err.message || "Failed to upload logo");
    }
  };

  const handleLogoRemove = async () => {
    try {
      const { error } = await updateProfile({ brand_logo_url: null });
      if (error) {
        toast.error("Failed to remove logo");
      } else {
        toast.success("Logo removed successfully");
      }
    } catch (err) {
      toast.error(err.message || "Failed to remove logo");
    }
  };

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

                <div className={styles.col} style={{ width: '100%', marginTop: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#527475', fontWeight: '600', fontSize: '14px' }}>Brand Logo</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                      style={{ width: '80px', height: '80px', borderRadius: '8px', border: '1px dashed #527475', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#f5f5f5', position: 'relative', cursor: 'pointer' }}
                      onClick={() => document.getElementById('profile-logo-upload').click()}
                      onMouseEnter={() => setIsLogoHovered(true)}
                      onMouseLeave={() => setIsLogoHovered(false)}
                    >
                      {profile?.brand_logo_url ? (
                        <>
                          <img src={profile.brand_logo_url} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          {isLogoHovered && (
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px' }}>
                              +
                            </div>
                          )}
                        </>
                      ) : (
                        <span style={{ color: '#999', fontSize: '12px' }}>No Logo</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="file" id="profile-logo-upload" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
                      <button
                        onClick={() => document.getElementById('profile-logo-upload').click()}
                        disabled={isUploading}
                        style={{ padding: '8px 16px', background: '#527475', color: '#fff', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                      >
                        {isUploading ? 'Uploading...' : (profile?.brand_logo_url ? 'Change Logo' : 'Upload Logo')}
                      </button>
                      {profile?.brand_logo_url && (
                        <button
                          onClick={handleLogoRemove}
                          disabled={isUploading}
                          style={{ padding: '8px', background: 'transparent', color: '#dc3545', border: '1px solid #dc3545', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Remove Logo"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
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
                    <h4>{userTransactions?.transaction_type === "SIGNUP_BONUS" ? "Free" : userTransactions?.transaction_type}</h4>
                    <p>
                      You are currently on the{" "}
                      {userTransactions?.transaction_type === "SIGNUP_BONUS" ? "Free" : userTransactions?.transaction_type} plan.
                    </p>
                  </div>
                  <div className={styles.buttonDesign}>
                    <button onClick={() => router.push("/#pricing")}>
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