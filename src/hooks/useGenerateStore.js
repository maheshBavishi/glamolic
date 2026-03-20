import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const initialSettings = {
  resolution: "2k",
  imageOrientation: "portrait",
  imageSize: "12x18",
  imagesPerProduct: 2,
  productName: "",
  modelConsistency: true,
  sameBackground: true,
  backgroundType: "studio",
  additionalInstructions: ["", ""],
  gender: "",
  isEcommerce: false,
  ecommerceViewTypes: [],
  additionalImagesCount: 0,
};

const initialProduct = {
  id: "1",
  clothingType: "",
  subCategory: "",
  otherCategory: "",
  frontImage: null,
  backImage: null,
  bottomBackImage: null,
  blouseImage: null,
  topImage: null,
  bottomImage: null,
  dupattaImage: null,
  referenceImage: null,
  additionalInstructions: ["", ""],
};

export const useGenerateStore = create(
  persist(
    (set) => ({
      products: [initialProduct],
      settings: initialSettings,
      preserveState: false,

      setPreserveState: (preserve) => set({ preserveState: preserve }),

      addProduct: () =>
        set((state) => {
          if (state.products.length >= 10) {
            // Using standard alert instead of library-specific toast
            alert("Maximum 10 products allowed");
            return state;
          }
          const firstProduct = state.products[0];
          const newProduct = {
            id: Date.now().toString(),
            clothingType: firstProduct?.clothingType || "",
            subCategory: firstProduct?.subCategory || "",
            otherCategory: firstProduct?.otherCategory || "",
            frontImage: null,
            backImage: null,
            bottomBackImage: null,
            blouseImage: null,
            topImage: null,
            bottomImage: null,
            dupattaImage: null,
            referenceImage: null,
            additionalInstructions: Array(state.settings.imagesPerProduct).fill(""),
          };
          return {
            ...state,
            products: [...state.products, newProduct],
          };
        }),

      removeProduct: (id) =>
        set((state) => {
          if (state.products.length <= 1) return state;
          return {
            ...state,
            products: state.products.filter((p) => p.id !== id),
          };
        }),

      updateProduct: (id, field, value) =>
        set((state) => {
          if (field === "clothingType" || field === "subCategory") {
            // Synchronize clothingType and subCategory across all products
            return {
              ...state,
              products: state.products.map((p) => ({
                ...p,
                [field]: value,
                ...(field === "clothingType" ? { subCategory: "" } : {}),
              })),
            };
          }
          return {
            ...state,
            products: state.products.map((p) =>
              p.id === id ? { ...p, [field]: value } : p,
            ),
          };
        }),

      updateSettings: (newSettings) =>
        set((state) => ({
          ...state,
          settings: { ...state.settings, ...newSettings },
        })),

      resetStore: () => {
        // Clear localStorage completely to prevent data leakage
        if (typeof window !== "undefined") {
            localStorage.removeItem("generate-storage");
        }
        set({
          products: [initialProduct],
          settings: initialSettings,
        });
      },
    }),
    {
      name: "generate-storage",
      // Use SSR-safe fallback for storage
      storage: createJSONStorage(() => typeof window !== "undefined" ? window.localStorage : null),
      partialize: (state) => ({
        settings: state.settings,
        products: state.products.map((p) => ({
          ...p,
          frontImage: null,
          backImage: null,
          bottomBackImage: null,
          blouseImage: null,
          topImage: null,
          bottomImage: null,
          dupattaImage: null,
          additionalInstructions: p.additionalInstructions || [],
        })),
      }),
    },
  ),
);
