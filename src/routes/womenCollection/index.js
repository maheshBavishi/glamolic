"use client";

import { generateImage } from "@/api/generateImage";
import Dropdown from "@/components/dropdown";
import Input from "@/components/input";
import Switch from "@/components/switch";
import UploadPhoto from "@/components/uploadPhoto";
import { useAuth } from "@/context/AuthContext";
import { useCreditsStore } from "@/hooks/useCreditsStore";
import { useGenerateStore } from "@/hooks/useGenerateStore";
import LeftIcon from "@/icons/leftIcon";
import ModelIcon from "@/icons/modelIcon";
import RightWhiteIcon from "@/icons/rightWhiteIcon";
import SettingIcon from "@/icons/settingIcon";
import ShopIcon from "@/icons/shopIcon";
import { supabase } from "@/integrations/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import styles from "./womenCollection.module.scss";

const PlusIcon = "/assets/icons/plus.svg";
const LineIcon = "/assets/icons/line.svg";
const DangerIcon = "/assets/icons/danger.svg";

import {
  backgroundTypeOptions,
  CREDITS_PER_IMAGE,
  ecommerceViewOptions,
  IMAGE_FIELD_KEYS,
  imageOrientationOptions,
  imagesPerProductOptions,
  landscapeImageSizeOptions,
  portraitImageSizeOptions,
  resolutionOptions,
  VIEW_ORDER,
} from "@/utils/generateImageUtils";

const normalizeCategoryName = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const shouldDisableSubCategory = (categoryName) => ["dress", "gown", "kurti", "lehenga", "lehenga choli"].includes(categoryName);
const shouldShowBlouseBottomDupatta = (categoryName) => categoryName.includes("lehenga");

const getSortedViews = (selectedViews = []) => {
  return [
    ...selectedViews.filter((viewType) => VIEW_ORDER.includes(viewType)).sort((a, b) => VIEW_ORDER.indexOf(a) - VIEW_ORDER.indexOf(b)),
    ...selectedViews.filter((viewType) => !VIEW_ORDER.includes(viewType)),
  ];
};

const formatViewLabel = (value) =>
  value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const validateImageFile = (file) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSizeInBytes = 7 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Only JPG, JPEG, PNG, and WebP formats are allowed",
    };
  }

  if (file.size > maxSizeInBytes) {
    return {
      valid: false,
      error: "Image size must not exceed 7MB",
    };
  }

  return { valid: true };
};

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        resolve("");
        return;
      }
      resolve(result.split(",")[1] || result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const getAspectRatio = (imageSize) => {
  switch (imageSize) {
    case "6x9":
    case "12x18":
    case "13x20":
    case "24x36":
      return "2:3";
    case "9x6":
    case "18x12":
    case "36x24":
      return "3:2";
    default:
      return "1:1";
  }
};

const getUploadFields = (categoryName) => {
  if (categoryName === "gown") {
    return [
      { key: "frontImage", label: "Front View" },
      { key: "dupattaImage", label: "Dupatta" },
      { key: "backImage", label: "Back View" },
    ];
  }

  if (categoryName === "kurti") {
    return [
      { key: "topImage", label: "Top" },
      { key: "bottomImage", label: "Bottom" },
      { key: "backImage", label: "Top Back View" },
    ];
  }

  if (categoryName === "pair") {
    return [
      { key: "topImage", label: "Top" },
      { key: "bottomImage", label: "Bottom" },
      { key: "backImage", label: "Top Back View" },
      { key: "bottomBackImage", label: "Bottom Back View" },
    ];
  }

  if (categoryName === "dress") {
    return [
      { key: "topImage", label: "Top" },
      { key: "bottomImage", label: "Bottom" },
      { key: "dupattaImage", label: "Dupatta" },
      { key: "backImage", label: "Top Back View" },
    ];
  }

  if (shouldShowBlouseBottomDupatta(categoryName)) {
    return [
      { key: "blouseImage", label: "Blouse" },
      { key: "bottomImage", label: "Bottom" },
      { key: "dupattaImage", label: "Dupatta" },
      { key: "backImage", label: "Top Back View" },
    ];
  }

  if (categoryName === "saree") {
    return [
      { key: "frontImage", label: "Front View" },
      { key: "blouseImage", label: "Blouse Image" },
      { key: "backImage", label: "Top Back View" },
    ];
  }

  if (categoryName === "blouse") {
    return [
      { key: "blouseImage", label: "Blouse Image" },
      { key: "backImage", label: "Back View" },
    ];
  }

  return [
    { key: "frontImage", label: "Front View" },
    { key: "backImage", label: "Back View" },
  ];
};

const resizeInstructions = (instructions, size) => {
  const safeSize = Math.max(1, Number(size) || 1);
  const source = Array.isArray(instructions) ? [...instructions] : [];

  if (source.length < safeSize) {
    source.push(...Array(safeSize - source.length).fill(""));
  } else if (source.length > safeSize) {
    source.length = safeSize;
  }

  return source;
};

const validateProducts = ({ products, getCategoryNameById, subCategories }) => {
  const errors = products.map(() => ({}));
  let isValid = true;

  products.forEach((product, index) => {
    const productErrors = {};

    if (!product.clothingType) {
      productErrors.clothingType = "Clothing Type is required";
      isValid = false;
    }

    const categoryName = normalizeCategoryName(getCategoryNameById(product.clothingType));
    const uploadFields = getUploadFields(categoryName);
    const hasAnyImage = uploadFields.some((field) => Boolean(product[field.key]));

    if (!hasAnyImage) {
      productErrors.imageError = "At least one image is required";
      uploadFields.forEach((field) => {
        productErrors[field.key] = "border_only";
      });
      isValid = false;
    }

    if (product.clothingType === "other") {
      if (!product.otherCategory?.trim()) {
        productErrors.subCategory = "Sub-category is required";
        isValid = false;
      }
    } else {
      const hasSubCategoryOptions = (subCategories[Number(product.clothingType)] || []).length > 0;
      const subCategoryRequired = !shouldDisableSubCategory(categoryName) && hasSubCategoryOptions;

      if (subCategoryRequired && !product.subCategory) {
        productErrors.subCategory = "Sub-category is required";
        isValid = false;
      }

      if (product.subCategory === "other" && !product.otherCategory?.trim()) {
        productErrors.otherCategory = "Please specify a sub-category";
        isValid = false;
      }
    }

    errors[index] = productErrors;
  });

  return { isValid, errors };
};

export default function WomenCollection() {
  const params = useParams();
  const router = useRouter();
  const { user, profile } = useAuth();
  const { credits, loading: creditsLoading, fetchCredits, resetCredits } = useCreditsStore();
  const { products, settings, addProduct, removeProduct, updateProduct, updateSettings, resetStore, preserveState, setPreserveState } =
    useGenerateStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState({});
  const [formErrors, setFormErrors] = useState({ products: [] });

  const productsSectionRef = useRef(null);
  const isSubmittingRef = useRef(false);
  const lastSubmissionTimeRef = useRef(0);

  const routeCategory = useMemo(() => {
    const raw = Array.isArray(params?.category) ? params.category[0] : params?.category;
    const normalized = String(raw || "women").toLowerCase();
    if (["women", "men", "kids"].includes(normalized)) {
      return normalized;
    }
    return "women";
  }, [params?.category]);

  const creditsPerImage = CREDITS_PER_IMAGE[settings.resolution] || 1;
  const estimatedCost = (products?.length || 0) * (settings.imagesPerProduct || 1) * creditsPerImage;
  const availableCredits = credits?.available_credits ?? profile?.tokens ?? 0;

  const getCategoryNameById = useCallback(
    (id) => {
      if (!id) return "clothing";
      if (id === "other") return "other";
      const matchedCategory = categories.find((category) => String(category.id) === String(id));
      return matchedCategory?.category_name || "clothing";
    },
    [categories],
  );

  const getSubCategoryNameById = useCallback(
    (subCategoryId) => {
      if (!subCategoryId) return "";
      if (subCategoryId === "none") return "None";

      for (const categoryId in subCategories) {
        const matched = subCategories[Number(categoryId)]?.find((sub) => String(sub.id) === String(subCategoryId));
        if (matched) return matched.subcategory_name || "";
      }

      return "";
    },
    [subCategories],
  );

  useEffect(() => {
    if (preserveState) {
      setPreserveState(false);
      if (settings.gender !== routeCategory) {
        updateSettings({ gender: routeCategory });
      }
      return;
    }

    resetStore();
    updateSettings({ gender: routeCategory });
  }, [preserveState, resetStore, routeCategory, setPreserveState, settings.gender, updateSettings]);

  useEffect(() => {
    if (settings.resolution === "1k") {
      updateSettings({ modelConsistency: false, sameBackground: false });
    }
  }, [settings.resolution, updateSettings]);

  useEffect(() => {
    let mounted = true;

    const fetchCategories = async () => {
      const { data, error } = await supabase.from("clothing_category").select("*").eq("clothing_wear_category", routeCategory.toUpperCase());

      if (!mounted) return;

      if (error) {
        console.error("Error fetching categories:", error);
      } else {
        setCategories(data || []);
      }

      const { data: subData, error: subError } = await supabase.from("clothing_subcategory").select("*");

      if (!mounted) return;

      if (subError) {
        console.error("Error fetching sub-categories:", subError);
      } else {
        const mappedSubCategories = {};
        (subData || []).forEach((subCategory) => {
          if (!mappedSubCategories[subCategory.category]) {
            mappedSubCategories[subCategory.category] = [];
          }
          mappedSubCategories[subCategory.category].push(subCategory);
        });
        setSubCategories(mappedSubCategories);
      }
    };

    fetchCategories();

    return () => {
      mounted = false;
    };
  }, [routeCategory]);
  useEffect(() => {
    if (user?.id) {
      fetchCredits(user.id);
    }
  }, [fetchCredits, user?.id]);

  useEffect(() => {
    if (!settings.isEcommerce) return;

    const selectedStandardCount = (settings.ecommerceViewTypes || []).filter((viewType) => VIEW_ORDER.includes(viewType)).length;
    const hasAdditional = (settings.ecommerceViewTypes || []).includes("additional");
    const totalImages = selectedStandardCount + (hasAdditional ? settings.additionalImagesCount || 0 : 0);

    if (settings.imagesPerProduct !== totalImages) {
      updateSettings({ imagesPerProduct: totalImages });
    }
  }, [settings.additionalImagesCount, settings.ecommerceViewTypes, settings.imagesPerProduct, settings.isEcommerce, updateSettings]);

  useEffect(() => {
    products.forEach((product) => {
      const nextInstructions = resizeInstructions(product.additionalInstructions, settings.imagesPerProduct || 1);
      const currentInstructions = Array.isArray(product.additionalInstructions) ? product.additionalInstructions : [];

      const isDifferent =
        currentInstructions.length !== nextInstructions.length ||
        currentInstructions.some((instruction, index) => instruction !== nextInstructions[index]);

      if (isDifferent) {
        updateProduct(product.id, "additionalInstructions", nextInstructions);
      }
    });
  }, [products, settings.imagesPerProduct, updateProduct]);

  const clearImageErrors = useCallback((productIndex) => {
    setFormErrors((prev) => {
      const nextProducts = [...(prev.products || [])];
      const previousErrorState = nextProducts[productIndex] || {};
      const nextErrorState = { ...previousErrorState, imageError: undefined };

      IMAGE_FIELD_KEYS.forEach((key) => {
        nextErrorState[key] = undefined;
      });

      nextProducts[productIndex] = nextErrorState;

      return { ...prev, products: nextProducts };
    });
  }, []);

  const handleImageChange = useCallback(
    (product, productIndex, key, selectedFile) => {
      if (selectedFile) {
        const validation = validateImageFile(selectedFile);
        if (!validation.valid) {
          toast.error(validation.error);
          return;
        }
      }

      updateProduct(product.id, key, selectedFile || null);

      if (selectedFile) {
        clearImageErrors(productIndex);
      }
    },
    [clearImageErrors, updateProduct],
  );

  const handleClothingTypeChange = (product, selectedOption) => {
    const value = selectedOption?.value || "";
    updateProduct(product.id, "clothingType", value);

    setFormErrors((prev) => ({
      ...prev,
      products: (prev.products || []).map((productError) => {
        const nextErrors = {
          ...productError,
          clothingType: undefined,
          subCategory: undefined,
          otherCategory: undefined,
          imageError: undefined,
        };

        IMAGE_FIELD_KEYS.forEach((key) => {
          nextErrors[key] = undefined;
        });

        return nextErrors;
      }),
    }));
  };

  const handleSubCategoryChange = (product, selectedOption) => {
    const value = selectedOption?.value || "";
    updateProduct(product.id, "subCategory", value);

    setFormErrors((prev) => ({
      ...prev,
      products: (prev.products || []).map((productError) => ({
        ...productError,
        subCategory: undefined,
        otherCategory: undefined,
      })),
    }));
  };

  const setProductError = (productIndex, key, value) => {
    setFormErrors((prev) => {
      const nextProducts = [...(prev.products || [])];
      const prevErrorState = nextProducts[productIndex] || {};
      nextProducts[productIndex] = { ...prevErrorState, [key]: value };
      return { ...prev, products: nextProducts };
    });
  };

  const validateForm = () => {
    const result = validateProducts({
      products,
      getCategoryNameById,
      subCategories,
    });

    setFormErrors({ products: result.errors });
    return result.isValid;
  };

  const selectedStandardCount = (settings.ecommerceViewTypes || []).filter((viewType) => VIEW_ORDER.includes(viewType)).length;
  const isAdditionalViewSelected = (settings.ecommerceViewTypes || []).includes("additional");
  const additionalImagesCount = settings.additionalImagesCount || 0;
  const occupiedSlots = selectedStandardCount + (isAdditionalViewSelected ? additionalImagesCount : 0);
  const remainingSlots = Math.max(0, 8 - occupiedSlots);

  const canAddProduct = useMemo(() => {
    return products.every((product) => {
      if (!product.clothingType) return false;

      const categoryName = normalizeCategoryName(getCategoryNameById(product.clothingType));
      const hasSubCategoryOptions = (subCategories[Number(product.clothingType)] || []).length > 0;
      const isSubCategoryRequired = !shouldDisableSubCategory(categoryName) && hasSubCategoryOptions;

      if (product.clothingType === "other" && !product.otherCategory?.trim()) {
        return false;
      }

      if (isSubCategoryRequired && !product.subCategory) {
        return false;
      }

      if (product.subCategory === "other" && !product.otherCategory?.trim()) {
        return false;
      }

      const uploadFields = getUploadFields(categoryName);
      return uploadFields.some((field) => Boolean(product[field.key]));
    });
  }, [getCategoryNameById, products, subCategories]);

  const handleAddProduct = () => {
    if (!canAddProduct) {
      toast.error("Please complete all required fields before adding another product.");
      return;
    }

    addProduct();
  };

  const handleGenerate = async () => {
    const now = Date.now();
    if (isGenerating || isSubmittingRef.current || now - lastSubmissionTimeRef.current < 1000) {
      return;
    }
    setIsGenerating(true);
    isSubmittingRef.current = true;
    lastSubmissionTimeRef.current = now;
    try {
      if (!user?.id) {
        toast("Please sign in to generate images");
        setPreserveState(true);
        router.push("/login");
        return;
      }
      if (!validateForm()) {
        setTimeout(() => {
          productsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
        return;
      }
      if (availableCredits < estimatedCost) {
        return;
      }
      const productsWithBase64 = await Promise.all(
        products.map(async (product) => {
          const categoryName = normalizeCategoryName(getCategoryNameById(product.clothingType));
          const frontBase64 = product.frontImage ? await fileToBase64(product.frontImage) : undefined;
          const backBase64 = product.backImage ? await fileToBase64(product.backImage) : undefined;
          const blouseBase64 = product.blouseImage ? await fileToBase64(product.blouseImage) : undefined;
          const topBase64 = product.topImage ? await fileToBase64(product.topImage) : undefined;
          const bottomBase64 = product.bottomImage ? await fileToBase64(product.bottomImage) : undefined;
          const bottomBackBase64 = product.bottomBackImage ? await fileToBase64(product.bottomBackImage) : undefined;
          const dupattaBase64 = product.dupattaImage ? await fileToBase64(product.dupattaImage) : undefined;
          const payloadProduct = {
            gender: routeCategory,
            itemType: getCategoryNameById(product.clothingType),
            subCategory:
              product.clothingType === "other"
                ? product.otherCategory || ""
                : product.subCategory === "other"
                  ? product.otherCategory || ""
                  : getSubCategoryNameById(product.subCategory),
            frontPreview: frontBase64,
            backPreview: backBase64,
            referenceImage: frontBase64 || backBase64 || topBase64 || blouseBase64 || bottomBase64 || dupattaBase64 || "",
            additionalInstructions: Array.isArray(product.additionalInstructions) ? product.additionalInstructions : [],
            poses: settings.isEcommerce
              ? getSortedViews(settings.ecommerceViewTypes || [])
                .filter((viewType) => VIEW_ORDER.includes(viewType))
                .map(formatViewLabel)
              : [],
          };

          if (routeCategory === "women" && categoryName === "saree" && blouseBase64) {
            payloadProduct.blouseImage = blouseBase64;
          }

          if (categoryName === "blouse" && blouseBase64) {
            payloadProduct.blouseImage = blouseBase64;
          }

          if (categoryName === "dress") {
            if (topBase64) payloadProduct.topImage = topBase64;
            if (bottomBase64) payloadProduct.bottomImage = bottomBase64;
            if (dupattaBase64) payloadProduct.dupattaImage = dupattaBase64;
          }

          if (categoryName === "kurti") {
            if (topBase64) payloadProduct.topImage = topBase64;
            if (bottomBase64) payloadProduct.bottomImage = bottomBase64;
          }

          if (categoryName === "pair") {
            if (topBase64) payloadProduct.topImage = topBase64;
            if (bottomBase64) payloadProduct.bottomImage = bottomBase64;
          }

          if (categoryName === "gown" && dupattaBase64) {
            payloadProduct.dupattaImage = dupattaBase64;
          }

          if (shouldShowBlouseBottomDupatta(categoryName)) {
            if (blouseBase64) payloadProduct.blouseImage = blouseBase64;
            if (bottomBase64) payloadProduct.bottomImage = bottomBase64;
            if (dupattaBase64) payloadProduct.dupattaImage = dupattaBase64;
          }

          if (bottomBackBase64) {
            payloadProduct.bottomBackImage = bottomBackBase64;
          }

          return payloadProduct;
        }),
      );

      const payload = {
        products: productsWithBase64,
        settings: {
          productName: settings.productName || "AI Photoshoot",
          resolution: settings.resolution || "1k",
          imageSize: settings.imageSize || "6x9",
          backgroundType: settings.backgroundType || "studio",
          unifiedBackground: settings.sameBackground || false,
          modelConsistency: settings.modelConsistency || false,
          additionalInstructions: settings.additionalInstructions || [],
          numberOfImages: settings.imagesPerProduct || 1,
          aspectRatio: getAspectRatio(settings.imageSize),
          startingVariationIdx: 0,
          low_cost: profile?.low_cost,
        },
      };

      const loadingToast = toast.loading("Starting generation...");
      const response = await generateImage(payload);
      console.log("🚀 ~ handleGenerate ~ response:", response);

      if (response?.status === "failed") {
        toast.dismiss(loadingToast);
        throw new Error(response?.message || "Generation failed");
      }

      const isQueuedResponse = response?.status === "queued";
      const hasTaskResponse = Boolean(response?.taskId || response?.batchId);
      const hasImmediateResult = Array.isArray(response?.groupedResults);

      if (isQueuedResponse || hasTaskResponse || hasImmediateResult) {
        toast.dismiss(loadingToast);
        toast.success(response?.message || "Generation started in background!");
        resetStore();
        resetCredits();
        setFormErrors({ products: [] });
        router.push("/history");
        return;
      }

      toast.dismiss(loadingToast);
      throw new Error(`Unexpected response format: ${JSON.stringify(response)}`);
    } catch (error) {
      toast.error(`Generation failed: ${error?.message || "Something went wrong"}`);
    } finally {
      setIsGenerating(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className={styles.womenCollection}>
      <div className="container-md">
        <div className={styles.boxCenteralignment}>
          <div className={styles.boxHeaderAlignment}>
            <button
              type="button"
              className={styles.backIcon}
              onClick={() => router.push("/category-selection")}
              aria-label="Back to category selection"
            >
              <LeftIcon />
            </button>
            <div className={styles.headerText}>
              <h2>Configure your {routeCategory} collection</h2>
              <p>Upload your product images and customize the generation settings to create professional, on model photoshoots.</p>
            </div>
          </div>

          <div className={styles.settingBox}>
            <div className={styles.title}>
              <h3>Generation Settings</h3>
            </div>

            <div className={styles.informationBox}>
              <Input
                label="Product Name"
                placeholder="Summer floral dress"
                value={settings.productName || ""}
                onChange={(event) => updateSettings({ productName: event.target.value })}
              />

              <div className={styles.twoCol}>
                <Dropdown
                  label="Resolution"
                  instanceId="resolution"
                  options={resolutionOptions}
                  value={resolutionOptions.find((option) => option.value === settings.resolution) || null}
                  onChange={(option) => updateSettings({ resolution: option?.value || "2k" })}
                  placeholder="Select resolution"
                />

                <Dropdown
                  label="Orientation"
                  instanceId="orientation"
                  options={imageOrientationOptions}
                  value={imageOrientationOptions.find((option) => option.value === settings.imageOrientation) || null}
                  onChange={(option) => {
                    const orientation = option?.value || "portrait";
                    const defaultSize = orientation === "portrait" ? "12x18" : "18x12";
                    updateSettings({ imageOrientation: orientation, imageSize: defaultSize });
                  }}
                  placeholder="Select orientation"
                />

                <Dropdown
                  label="Image size"
                  instanceId="image-size"
                  options={settings.imageOrientation === "landscape" ? landscapeImageSizeOptions : portraitImageSizeOptions}
                  value={
                    (settings.imageOrientation === "landscape" ? landscapeImageSizeOptions : portraitImageSizeOptions).find(
                      (option) => option.value === settings.imageSize,
                    ) || null
                  }
                  onChange={(option) => updateSettings({ imageSize: option?.value || "12x18" })}
                  placeholder="Select image size"
                />

                <Dropdown
                  label="Background Type"
                  instanceId="background-type"
                  options={backgroundTypeOptions}
                  value={backgroundTypeOptions.find((option) => option.value === settings.backgroundType) || null}
                  onChange={(option) => updateSettings({ backgroundType: option?.value || "studio" })}
                  placeholder="Select background type"
                />

                {!settings.isEcommerce ? (
                  <Dropdown
                    label="Images/Product"
                    instanceId="images-per-product"
                    options={imagesPerProductOptions}
                    value={imagesPerProductOptions.find((option) => option.value === settings.imagesPerProduct) || null}
                    onChange={(option) => {
                      const selectedCount = Number(option?.value) || 1;
                      updateSettings({ imagesPerProduct: selectedCount });
                    }}
                    placeholder="Select image count"
                  />
                ) : null}
              </div>

              {settings.isEcommerce ? (
                <div className={styles.viewSelection}>
                  <div className={styles.viewSelectionHeader}>
                    <p>Select views</p>
                  </div>

                  <div className={styles.viewOptions}>
                    {ecommerceViewOptions.map((viewOption) => {
                      const isSelected = (settings.ecommerceViewTypes || []).includes(viewOption.value);
                      return (
                        <div key={viewOption.value} className={`${styles.viewChip} ${isSelected ? styles.viewChipActive : ""}`}>
                          <button
                            type="button"
                            className={styles.viewChipButton}
                            onClick={() => {
                              const current = settings.ecommerceViewTypes || [];

                              if (isSelected) {
                                updateSettings({ ecommerceViewTypes: current.filter((value) => value !== viewOption.value) });
                                return;
                              }

                              if (remainingSlots <= 0) {
                                toast.error("You can select up to 8 total views.");
                                return;
                              }

                              updateSettings({ ecommerceViewTypes: [...current, viewOption.value] });
                            }}
                          >
                            <span className={`${styles.chipDot} ${isSelected ? styles.chipDotActive : ""}`}>
                              {isSelected ? String.fromCharCode(10003) : ""}
                            </span>
                            {viewOption.label}
                          </button>
                        </div>
                      );
                    })}

                    <div
                      className={`${styles.viewChip} ${styles.additionalChip} ${(settings.ecommerceViewTypes || []).includes("additional") ? styles.viewChipActive : ""}`}
                    >
                      <button
                        type="button"
                        className={styles.additionalToggle}
                        onClick={() => {
                          const current = settings.ecommerceViewTypes || [];
                          const isSelected = current.includes("additional");

                          if (isSelected) {
                            updateSettings({
                              ecommerceViewTypes: current.filter((value) => value !== "additional"),
                              additionalImagesCount: 0,
                            });
                            return;
                          }

                          if (remainingSlots <= 0) {
                            toast.error("You can select up to 8 total views.");
                            return;
                          }

                          updateSettings({
                            ecommerceViewTypes: [...current, "additional"],
                            additionalImagesCount: 1,
                          });
                        }}
                      >
                        <span
                          className={`${styles.chipDot} ${(settings.ecommerceViewTypes || []).includes("additional") ? styles.chipDotActive : ""}`}
                        >
                          {(settings.ecommerceViewTypes || []).includes("additional") ? String.fromCharCode(10003) : ""}
                        </span>
                        Additional setting
                      </button>

                      {(settings.ecommerceViewTypes || []).includes("additional") ? <div className={styles.additionalSeparator} /> : null}

                      {(settings.ecommerceViewTypes || []).includes("additional") ? (
                        <div className={styles.additionalCounter}>
                          <button
                            type="button"
                            className={styles.counterButton}
                            onClick={() => {
                              if (additionalImagesCount > 1) {
                                updateSettings({ additionalImagesCount: additionalImagesCount - 1 });
                              }
                            }}
                          >
                            -
                          </button>
                          <span className={styles.counterValue}>{additionalImagesCount}</span>
                          <button
                            type="button"
                            className={styles.counterButton}
                            onClick={() => {
                              const maxAdditional = Math.max(0, 8 - selectedStandardCount);
                              if (additionalImagesCount < maxAdditional) {
                                updateSettings({ additionalImagesCount: additionalImagesCount + 1 });
                              }
                            }}
                          >
                            +
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className={styles.subbox}>
                <div className={styles.items}>
                  <div className={styles.icontext}>
                    <div className={styles.icon}>
                      <ShopIcon />
                    </div>
                    <div>
                      <h5>Ecommerce Image</h5>
                      <p>Specialized for product listings</p>
                    </div>
                  </div>
                  <Switch
                    checked={Boolean(settings.isEcommerce)}
                    onChange={(checked) => {
                      if (!checked) {
                        updateSettings({
                          isEcommerce: false,
                          ecommerceViewTypes: [],
                          additionalImagesCount: 0,
                          imagesPerProduct: 2,
                        });
                        return;
                      }

                      updateSettings({
                        isEcommerce: true,
                        ecommerceViewTypes: settings.ecommerceViewTypes || [],
                        additionalImagesCount: settings.additionalImagesCount || 0,
                      });
                    }}
                  />
                </div>

                <div className={styles.items}>
                  <div className={styles.icontext}>
                    <div className={styles.icon}>
                      <ModelIcon />
                    </div>
                    <div>
                      <h5>Model Consistency</h5>
                      <p>Keep same model across images</p>
                    </div>
                  </div>
                  <Switch
                    checked={Boolean(settings.modelConsistency)}
                    disabled={settings.resolution === "1k"}
                    onChange={(checked) => updateSettings({ modelConsistency: checked })}
                  />
                </div>

                <div className={styles.items}>
                  <div className={styles.icontext}>
                    <div className={styles.icon}>
                      <SettingIcon />
                    </div>
                    <div>
                      <h5>Unified Background</h5>
                      <p>Same setting for all products</p>
                    </div>
                  </div>
                  <Switch
                    checked={Boolean(settings.sameBackground)}
                    disabled={settings.resolution === "1k"}
                    onChange={(checked) => updateSettings({ sameBackground: checked })}
                  />
                </div>
              </div>
            </div>

            <div className={styles.title}>
              <h3>Product Details</h3>
            </div>

            <div ref={productsSectionRef}>
              {products.map((product, index) => {
                const productErrors = formErrors.products?.[index] || {};
                const categoryName = normalizeCategoryName(getCategoryNameById(product.clothingType));
                const uploadFields = getUploadFields(categoryName);
                const hasSubCategoryOptions = (subCategories[Number(product.clothingType)] || []).length > 0;
                const showSubCategoryField = !shouldDisableSubCategory(categoryName) && (product.clothingType === "other" || hasSubCategoryOptions);
                const isCategoryLocked = index > 0 && Boolean(products[0]?.clothingType);
                const isLastProduct = index === products.length - 1;
                const clothingTypeOptions = [
                  ...(categories || []).map((category) => ({ value: String(category.id), label: category.category_name })),
                  { value: "other", label: "Other" },
                ];
                const selectedSubOptions = (subCategories[Number(product.clothingType)] || []).map((subCategory) => ({
                  value: String(subCategory.id),
                  label: subCategory.subcategory_name,
                }));
                const subCategoryOptions = [...selectedSubOptions, { value: "none", label: "None" }, { value: "other", label: "Other" }];

                return (
                  <div key={product.id} className={styles.productInformation} style={index > 0 ? { marginTop: "16px" } : undefined}>
                    {products.length > 1 ? (
                      <div className={styles.productHeader}>
                        <p>Product {index + 1}</p>
                        {index > 0 ? (
                          <button type="button" onClick={() => removeProduct(product.id)} className={styles.removeProductBtn}>
                            Remove
                          </button>
                        ) : null}
                      </div>
                    ) : null}

                    <div className={styles.twoCol}>
                      <Dropdown
                        label="Clothing Type *"
                        instanceId={`clothing-type-${product.id}-${index}`}
                        options={clothingTypeOptions}
                        value={clothingTypeOptions.find((option) => option.value === product.clothingType) || null}
                        onChange={(option) => handleClothingTypeChange(product, option)}
                        isDisabled={isCategoryLocked}
                        error={productErrors.clothingType}
                        placeholder="Select type"
                      />

                      {showSubCategoryField ? (
                        product.clothingType === "other" ? (
                          <Input
                            label="Specify Category"
                            placeholder="Enter category"
                            value={product.otherCategory || ""}
                            onChange={(event) => {
                              updateProduct(product.id, "otherCategory", event.target.value);
                              setProductError(index, "subCategory", undefined);
                              setProductError(index, "otherCategory", undefined);
                            }}
                            error={productErrors.subCategory}
                            disabled={index > 0 && !products[0]?.subCategory}
                          />
                        ) : (
                          <Dropdown
                            label="Sub-Category *"
                            instanceId={`sub-category-${product.id}-${index}`}
                            options={subCategoryOptions}
                            value={subCategoryOptions.find((option) => option.value === product.subCategory) || null}
                            onChange={(option) => handleSubCategoryChange(product, option)}
                            isDisabled={isCategoryLocked}
                            error={productErrors.subCategory}
                            placeholder="Select sub-category"
                          />
                        )
                      ) : null}
                    </div>

                    {product.subCategory === "other" ? (
                      <div style={{ paddingBottom: "8px" }}>
                        <Input
                          label="Specify Sub-Category *"
                          placeholder="Specify sub-category"
                          value={product.otherCategory || ""}
                          onChange={(event) => {
                            updateProduct(product.id, "otherCategory", event.target.value);
                            setProductError(index, "otherCategory", undefined);
                          }}
                          error={productErrors.otherCategory}
                          disabled={index > 0 && !products[0]?.subCategory}
                        />
                      </div>
                    ) : null}

                    <div className={styles.uploadGrid}>
                      {uploadFields.map((field) => {
                        const fieldError = productErrors[field.key];
                        return (
                          <div key={field.key}>
                            <label>{field.label}</label>
                            <UploadPhoto
                              file={product[field.key]}
                              hasError={Boolean(fieldError)}
                              error={fieldError && fieldError !== "border_only" ? fieldError : ""}
                              onFileChange={(selectedFile) => handleImageChange(product, index, field.key, selectedFile)}
                              onRemove={() => updateProduct(product.id, field.key, null)}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {productErrors.imageError ? <p className={styles.inlineError}>{productErrors.imageError}</p> : null}

                    <div className={styles.title}>
                      <h3>Additional Instructions</h3>
                    </div>

                    <div className={styles.textareaGrid}>
                      {settings.isEcommerce
                        ? (() => {
                          const sortedViews = getSortedViews(settings.ecommerceViewTypes || []);
                          const standardViews = sortedViews.filter((viewType) => VIEW_ORDER.includes(viewType));
                          const standardCount = standardViews.length;
                          const totalImages = settings.imagesPerProduct || 1;

                          if (totalImages <= 0) {
                            return (
                              <div>
                                <label>Instructions</label>
                                <textarea
                                  placeholder="Instructions..."
                                  value={Array.isArray(product.additionalInstructions) ? product.additionalInstructions[0] || "" : ""}
                                  onChange={(event) => {
                                    updateProduct(product.id, "additionalInstructions", [event.target.value]);
                                  }}
                                />
                              </div>
                            );
                          }

                          return (
                            <>
                              {standardCount > 0 ? (
                                <div>
                                  <label>Instructions ({standardViews.map(formatViewLabel).join(", ")})</label>
                                  <textarea
                                    placeholder="Instructions for selected views..."
                                    value={Array.isArray(product.additionalInstructions) ? product.additionalInstructions[0] || "" : ""}
                                    onChange={(event) => {
                                      const next = resizeInstructions(product.additionalInstructions, totalImages);
                                      for (let i = 0; i < standardCount; i += 1) {
                                        next[i] = event.target.value;
                                      }
                                      updateProduct(product.id, "additionalInstructions", next);
                                    }}
                                  />
                                </div>
                              ) : null}

                              {Array.from({ length: Math.max(totalImages - standardCount, 0) }).map((_, additionalIndex) => {
                                const realIndex = standardCount + additionalIndex;
                                return (
                                  <div key={`additional-${product.id}-${additionalIndex}`}>
                                    <label>Additional Image {additionalIndex + 1}</label>
                                    <textarea
                                      placeholder={`Instructions for additional image ${additionalIndex + 1}...`}
                                      value={Array.isArray(product.additionalInstructions) ? product.additionalInstructions[realIndex] || "" : ""}
                                      onChange={(event) => {
                                        const next = resizeInstructions(product.additionalInstructions, totalImages);
                                        next[realIndex] = event.target.value;
                                        updateProduct(product.id, "additionalInstructions", next);
                                      }}
                                    />
                                  </div>
                                );
                              })}
                            </>
                          );
                        })()
                        : Array.from({ length: settings.imagesPerProduct || 1 }).map((_, imageIndex) => (
                          <div key={`${product.id}-${imageIndex}`}>
                            <label>Image {imageIndex + 1}</label>
                            <textarea
                              placeholder={`Instruction image ${imageIndex + 1}...`}
                              value={Array.isArray(product.additionalInstructions) ? product.additionalInstructions[imageIndex] || "" : ""}
                              onChange={(event) => {
                                const next = resizeInstructions(product.additionalInstructions, settings.imagesPerProduct || 1);
                                next[imageIndex] = event.target.value;
                                updateProduct(product.id, "additionalInstructions", next);
                              }}
                            />
                          </div>
                        ))}
                    </div>

                    {isLastProduct ? (
                      <>
                        <div
                          className={styles.addanother}
                          style={{ cursor: canAddProduct ? "pointer" : "not-allowed", opacity: canAddProduct ? 0.9 : 0.6 }}
                          onClick={handleAddProduct}
                        >
                          <div className={styles.iconcenter}>
                            <img src={PlusIcon} alt="PlusIcon" />
                          </div>
                          <p>Add another product</p>
                        </div>

                        {!canAddProduct ? (
                          <div className={styles.importantMessage}>
                            <p>Please complete all required fields (at least one image) in the current product before adding another.</p>
                          </div>
                        ) : null}

                        <div className={styles.estimateBox}>
                          <div className={styles.contentAlignment}>
                            <div className={styles.leftAlignment}>
                              <p>Estimated Cost</p>
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
                            {(availableCredits || 0) < estimatedCost ? (
                              <button type="button" onClick={() => router.push("/profile")}>
                                Upgrade to Pro
                                <RightWhiteIcon />
                              </button>
                            ) : (
                              <button type="button" onClick={handleGenerate} disabled={isGenerating}>
                                {isGenerating ? "Generating..." : "Generate Photoshoot"}
                                {!isGenerating ? <RightWhiteIcon /> : null}
                              </button>
                            )}
                          </div>
                        </div>

                        <div className={styles.noteAlignment}>
                          <div className={styles.note}>
                            <img src={DangerIcon} alt="DangerIcon" />
                            <p>
                              <span>Note: </span> Generated images will be automatically deleted from history after 3 day.
                            </p>
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}