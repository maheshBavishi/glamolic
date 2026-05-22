"use client";
import { generateVideo } from "@/api/generateVideo";
import Dropdown from "@/components/dropdown";
import Switch from "@/components/switch";
import UploadPhoto from "@/components/uploadPhoto";
import { useAuth } from "@/context/AuthContext";
import { useCreditsStore } from "@/hooks/useCreditsStore";
import { useImageUpload } from "@/hooks/useImageUpload";
import BottomIcon from "@/icons/bottomIcon";
import BottomRightIcon from "@/icons/bottomRightIcon";
import CameraIcon from "@/icons/cameraIcon";
// import CenterIcon from "@/icons/centerIcon";
import LandscapeIcon from "@/icons/landscapeIcon";
import MobileIcon from "@/icons/mobileIcon";
import RightWhiteIcon from "@/icons/rightWhiteIcon";
import TopLeftIcon from "@/icons/topLeftIcon";
import TopRightIcon from "@/icons/topRightIcon";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import styles from "./videoGeneration.module.scss";
import { components as selectComponents } from 'react-select';

const DefaultVideoImage = "/assets/images/video-img.png";
const LineIcon = "/assets/icons/line.svg";
const durationOptions = [
  { value: "15", label: "15 seconds" },
];

const getEstimatedCostByDuration = (duration) => {
  // if (duration === "5") return 6;
  // if (duration === "10") return 11;
  if (duration === "15") return 16;
  // if (duration === "20") return 18;
  // if (duration === "30") return 24;
  return 0;
};

const normalizeLogoPosition = (position) => (position === "center" ? "right_top" : position);

const DurationSingleValue = ({ children, selectProps, ...props }) => {
  return (
    <selectComponents.SingleValue {...props} selectProps={selectProps}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        fontFamily: 'var(--font-heebo)',
        fontSize: '16px',
        fontWeight: 500,
        fontStyle: 'normal',
        color: 'rgba(18, 18, 18, 0.60)'
      }}>
        <span>{children}</span>
        <span style={{
          marginRight: '8px',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{
            color: 'rgba(18, 18, 18, 0.60)',
            fontWeight: 500
          }}>16 credits</span>
          <span style={{
            width: '1px',
            height: '16px',
            background: 'rgba(18, 18, 18, 0.15)',
            display: 'inline-block'
          }} />
          <span style={{
            color: '#527475',
            fontWeight: 600
          }}></span>
        </span>
      </div>
    </selectComponents.SingleValue>
  );
};

const DurationOption = ({ children, ...props }) => {
  return (
    <selectComponents.Option {...props}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        fontFamily: 'var(--font-heebo)',
        fontSize: '16px',
        fontWeight: 500,
        fontStyle: 'normal',
        color: '#121212'
      }}>
        <span>{children}</span>
        <span style={{
          color: 'rgba(18, 18, 18, 0.60)',
          fontWeight: 500
        }}>
          16 credits
        </span>
      </div>
    </selectComponents.Option>
  );
};

export default function VideoGeneration({ imageUrl = "", productName = "" }) {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { loading: creditsLoading, credits, fetchCredits } = useCreditsStore();
  const { uploadImage, validateImageFile, isUploading } = useImageUpload();

  const [referenceFile, setReferenceFile] = useState(imageUrl || null);
  const [logoFile, setLogoFile] = useState(null);
  const [formData, setFormData] = useState({
    prompt: "",
    duration: "15",
    aspectRatio: "portrait",
    audioType: "none",
    logo: null,
    logo_position: "",
    logo_size: "",
    show_product_name: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  const estimatedCost = useMemo(() => getEstimatedCostByDuration(formData.duration), [formData.duration]);
  const availableCredits = credits?.available_credits ?? profile?.tokens ?? 0;
  const activeStyle = {
    border: "1px solid #527475",
    background: "#EFF3F3",
  };

  useEffect(() => {
    if (profile?.video_generation !== true) {
      router.push("/");
    }
  }, [profile]);

  useEffect(() => {
    if (user?.id) {
      fetchCredits(user.id);
    }
  }, [fetchCredits, user?.id]);

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    if (!referenceFile) {
      errors.referenceFile = "Please upload a reference image";
      isValid = false;
    }
    if (!String(formData.prompt || "").trim()) {
      errors.prompt = "Please enter a prompt for the video";
      isValid = false;
    }
    if (!logoFile) {
      errors.logoFile = "Please upload a logo";
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (key === "prompt" && formErrors.prompt) {
      setFormErrors((prev) => ({ ...prev, prompt: undefined }));
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setFormData((prev) => ({
      ...prev,
      logo: null,
      logo_position: "",
      logo_size: "",
    }));
  };

  const handleReferenceUpload = (selectedFile) => {
    if (!selectedFile) {
      setReferenceFile(null);
      return;
    }
    const validation = validateImageFile(selectedFile, Infinity);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }
    setReferenceFile(selectedFile);
    if (formErrors.referenceFile) {
      setFormErrors((prev) => ({ ...prev, referenceFile: undefined }));
    }
  };

  const handleLogoUpload = (selectedFile) => {
    if (!selectedFile) {
      handleRemoveLogo();
      return;
    }
    const validation = validateImageFile(selectedFile, Infinity);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }
    setLogoFile(selectedFile);
    if (formErrors.logoFile) {
      setFormErrors((prev) => ({ ...prev, logoFile: undefined }));
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = String(reader.result || "").split(",")[1] || "";
      setFormData((prev) => ({
        ...prev,
        logo: base64 || null,
        logo_position: prev.logo_position?.trim() || "right_top",
        logo_size: prev.logo_size?.trim() || "small",
      }));
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleGenerate = async () => {
    if (!validateForm()) {
      return;
    }
    setIsGenerating(true);
    try {
      let finalImageUrl = "";
      if (referenceFile instanceof File) {
        finalImageUrl = await uploadImage(referenceFile, user?.id, "video-references");
      } else if (typeof referenceFile === "string") {
        finalImageUrl = referenceFile;
      }

      const payload = {
        ...(finalImageUrl ? { image_link: finalImageUrl } : {}),
        user_input: formData.prompt,
        video_duration: parseInt(formData.duration, 10),
        aspect_ratio: formData.aspectRatio,
        audio_type: formData.audioType,
        ...(formData.logo
          ? {
            logo: formData.logo,
            logo_position: normalizeLogoPosition(formData.logo_position) || "right_top",
            logo_size: formData.logo_size || "small",
          }
          : {}),
        ...(productName ? { product_name: productName } : {}),
        show_product_name: Boolean(formData.show_product_name),
        model: "bytedance/seedance-2.0",
        provider: "wavespeed",
        upscaling: false,
      };
      await generateVideo(payload);
      toast.success("Video generation started! You will be notified when it's ready.");
      router.push("/history?tab=videos");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to start video generation";
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={styles.videoGeneration}>
      <div className="container-md">
        <div className={styles.boxCenteralignment}>
          <div className={styles.boxHeaderAlignment}>
            <div>
              <h2>Configure your Video generation</h2>
              <p>Tansform your static image into a dynamic video with AI.customize your settings below.</p>
            </div>
          </div>
          <div className={styles.mainBoxDesign}>
            <div className={styles.subbox}>
              <div className={styles.maingrid}>
                <div className={styles.referenceCol}>
                  <div className={styles.uploadText}>
                    <label>Reference Image <span style={{ color: '#E23030' }}>*</span></label>
                  </div>
                  <UploadPhoto
                    file={referenceFile}
                    onFileChange={handleReferenceUpload}
                    onRemove={() => setReferenceFile(null)}
                    placeholderTitle="Upload Reference"
                    placeholderSubTitle="Drag & drop or click to select a reference image"
                    placeholderMeta="PNG, JPG, WebP"
                    placeholderNote="Please upload an image containing a single model only. Do not upload only garment images, a model image is mandatory for generation."
                    error={formErrors.referenceFile}
                    className={styles.referenceUpload}
                  />
                </div>
                <div>
                  <div className={styles.textareaDesign}>
                    <label>Video prompt <span style={{ color: '#E23030' }}>*</span></label>
                    <textarea
                      data-lenis-prevent={true}
                      placeholder="Describe the motion and atmosphere (e.g., 'Slow cinematic pan, dust particles floating in light rays')"
                      value={formData.prompt}
                      onChange={(event) => handleChange("prompt", event.target.value)}
                      style={formErrors.prompt ? { border: "1px solid #E23030" } : undefined}
                    />
                    {formErrors.prompt ? <p style={{ color: "#E23030", fontSize: "14px", marginTop: "6px" }}>{formErrors.prompt}</p> : null}
                  </div>
                  <div className={styles.uploadText}>
                    <label>Logo <span style={{ color: '#E23030' }}>*</span></label>
                  </div>
                  <UploadPhoto
                    file={logoFile}
                    onFileChange={handleLogoUpload}
                    onRemove={handleRemoveLogo}
                    placeholderTitle="Upload logo"
                    placeholderSubTitle="Drag & drop or click to select a logo"
                    placeholderMeta="PNG, JPG, WebP"
                    error={formErrors.logoFile}
                  />
                </div>
              </div>
              <div className={styles.logoposition}>
                <p>Logo Position</p>
                <div className={styles.logogrid}>
                  <div
                    className={styles.items}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleChange("logo_position", "left_bottom")}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleChange("logo_position", "left_bottom");
                      }
                    }}
                    style={formData.logo_position === "left_bottom" ? activeStyle : undefined}
                  >
                    <BottomIcon />
                    <span>Bottom Left</span>
                  </div>
                  <div
                    className={styles.items}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleChange("logo_position", "right_bottom")}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleChange("logo_position", "right_bottom");
                      }
                    }}
                    style={formData.logo_position === "right_bottom" ? activeStyle : undefined}
                  >
                    <BottomRightIcon />
                    <span>Bottom Right</span>
                  </div>
                  <div
                    className={styles.items}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleChange("logo_position", "right_top")}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleChange("logo_position", "right_top");
                      }
                    }}
                    style={formData.logo_position === "right_top" ? activeStyle : undefined}
                  >
                    <TopRightIcon />
                    <span>Top Right</span>
                  </div>
                  <div
                    className={styles.items}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleChange("logo_position", "left_top")}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleChange("logo_position", "left_top");
                      }
                    }}
                    style={formData.logo_position === "left_top" ? activeStyle : undefined}
                  >
                    <TopLeftIcon />
                    <span>Top Left</span>
                  </div>
                </div>
              </div>
              <div className={styles.logosize}>
                <p>Logo Size</p>
                <div className={styles.threeCol}>
                  <input
                    type="text"
                    value="small"
                    readOnly
                    onClick={() => handleChange("logo_size", "small")}
                    style={formData.logo_size === "small" ? activeStyle : undefined}
                  />
                  <input
                    type="text"
                    value="Medium"
                    readOnly
                    onClick={() => handleChange("logo_size", "medium")}
                    style={formData.logo_size === "medium" ? activeStyle : undefined}
                  />
                  <input
                    type="text"
                    value="Large"
                    readOnly
                    onClick={() => handleChange("logo_size", "large")}
                    style={formData.logo_size === "large" ? activeStyle : undefined}
                  />
                </div>
              </div>
              <div className={styles.topbottomAlignment}>
                <Dropdown
                  label="Duration"
                  placeholder="15 seconds"
                  options={durationOptions}
                  value={durationOptions.find((option) => option.value === formData.duration) || null}
                  onChange={(selectedOption) => handleChange("duration", selectedOption?.value || "10")}
                  components={{ SingleValue: DurationSingleValue, Option: DurationOption }}
                  availableCredits={availableCredits}
                  creditsLoading={creditsLoading}
                  disabled
                />
              </div>
              <div className={styles.ratio}>
                <p>Aspect Ratio</p>
                <div className={styles.twocol}>
                  <div
                    className={styles.items}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleChange("aspectRatio", "portrait")}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleChange("aspectRatio", "portrait");
                      }
                    }}
                    style={formData.aspectRatio === "portrait" ? activeStyle : undefined}
                  >
                    <MobileIcon />
                    <span>Portrait (9:16)</span>
                  </div>
                  <div
                    className={styles.items}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleChange("aspectRatio", "landscape")}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleChange("aspectRatio", "landscape");
                      }
                    }}
                    style={formData.aspectRatio === "landscape" ? activeStyle : undefined}
                  >
                    <LandscapeIcon />
                    <span>Landscape (16:9)</span>
                  </div>
                </div>
              </div>
              <div className={styles.audiotype}>
                <p>Audio Type</p>
                <div className={styles.three}>
                  <div
                    className={styles.items}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleChange("audioType", "none")}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleChange("audioType", "none");
                      }
                    }}
                    style={formData.audioType === "none" ? activeStyle : undefined}
                  >
                    <span>None</span>
                  </div>
                  <div
                    className={styles.items}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleChange("audioType", "instrumental")}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleChange("audioType", "instrumental");
                      }
                    }}
                    style={formData.audioType === "instrumental" ? activeStyle : undefined}
                  >
                    <span>Instrumental</span>
                  </div>
                  <div
                    className={styles.items}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleChange("audioType", "voice")}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleChange("audioType", "voice");
                      }
                    }}
                    style={formData.audioType === "voice" ? activeStyle : undefined}
                  >
                    <span>Voice Over</span>
                  </div>
                </div>
              </div>
              {productName ? (
                <div className={styles.duration}>
                  <h6>Duration</h6>
                  <div className={styles.subbox}>
                    <div className={styles.items}>
                      <div className={styles.icontext}>
                        <div className={styles.icon}>
                          <CameraIcon />
                        </div>
                        <div>
                          <h5>Show Product Name</h5>
                          <p>Display the product name as a text overlay on the video</p>
                        </div>
                      </div>
                      <div>
                        <Switch
                          checked={Boolean(formData.show_product_name)}
                          onChange={(checked) => setFormData((prev) => ({ ...prev, show_product_name: checked }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              <div className={styles.estimateBox}>
                <div className={styles.contentAlignment}>
                  <div className={styles.leftAlignment}>
                    <p>Cost</p>
                    <button>{estimatedCost} credits</button>
                  </div>
                  <div className={styles.line}>
                    <img src={LineIcon} alt="LineIcon" />
                  </div>
                  <div className={styles.leftAlignment}>
                    <p>Available Balance</p>
                    <button>{creditsLoading ? "..." : `${availableCredits} credits`}</button>
                  </div>
                </div>
                <div className={styles.buttonDesign}>
                  {availableCredits < estimatedCost ? (
                    <button type="button" onClick={() => router.push("/profile")}>
                      Upgrade to Pro
                      <RightWhiteIcon />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleGenerate}
                      disabled={isGenerating || isUploading}
                      style={isGenerating || isUploading ? { opacity: 0.7, cursor: "not-allowed" } : undefined}
                    >
                      {isUploading ? "Uploading image..." : isGenerating ? "Generating..." : "Generate Video"}
                      {!(isGenerating || isUploading) ? <RightWhiteIcon /> : null}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
