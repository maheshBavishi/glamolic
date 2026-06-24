import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const GENERATE_STORAGE_KEY = "generate-storage";
const NON_PERSISTED_IMAGE_FIELDS = [
  "frontImage",
  "backImage",
  "bottomBackImage",
  "blouseImage",
  "topImage",
  "bottomImage",
  "dupattaImage",
  "referenceImage",
];

const createInitialSettings = () => ({
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
  multipleModal: false,
  applyLogo: false,
  logoSize: "medium",
  show_product_name: false,
});

const createInitialProduct = (id = "1", imagesPerProduct = 2) => ({
  id,
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
  additionalInstructions: Array(imagesPerProduct).fill(""),
});

const sanitizeProductForRetention = (product) => {
  const nextProduct = {
    ...product,
    additionalInstructions: Array.isArray(product?.additionalInstructions) ? product.additionalInstructions : [],
  };

  NON_PERSISTED_IMAGE_FIELDS.forEach((field) => {
    nextProduct[field] = null;
  });

  return nextProduct;
};

const sanitizeProductsForRetention = (products = []) => products.map((product) => sanitizeProductForRetention(product));

const createInitialState = (settingsOverrides = {}) => {
  const settings = {
    ...createInitialSettings(),
    ...settingsOverrides,
  };

  return {
    products: [createInitialProduct("1", settings.imagesPerProduct)],
    settings,
    preserveState: false,
    previousSettings: null,
    previousProducts: null,
  };
};

export const useGenerateStore = create(
  persist(
    (set) => ({
      ...createInitialState(),

      setPreserveState: (preserve) => set({ preserveState: preserve }),

      setMultipleModal: (enabled) =>
        set((state) => {
          if (!enabled) {
            let nextProducts = state.previousProducts ? state.previousProducts : state.products;
            if (!state.previousProducts && nextProducts.length > 1) {
              nextProducts = [nextProducts[0]];
            }
            return {
              ...state,
              products: nextProducts,
              settings: {
                ...state.settings,
                multipleModal: false,
                ...(state.previousSettings ? state.previousSettings : {}),
              },
              previousSettings: null,
              previousProducts: null,
            };
          }

          const previousSettings = {
            isEcommerce: state.settings.isEcommerce,
            ecommerceViewTypes: state.settings.ecommerceViewTypes,
            additionalImagesCount: state.settings.additionalImagesCount,
            modelConsistency: state.settings.modelConsistency,
            sameBackground: state.settings.sameBackground,
          };
          const previousProducts = state.products;

          let nextProducts = [...state.products];
          if (nextProducts.length === 1) {
            const firstProduct = nextProducts[0];
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
            nextProducts.push(newProduct);
          } else if (nextProducts.length > 2) {
            nextProducts = nextProducts.slice(0, 2);
          }

          return {
            ...state,
            previousSettings,
            previousProducts,
            products: nextProducts,
            settings: {
              ...state.settings,
              multipleModal: true,
              isEcommerce: false,
              ecommerceViewTypes: [],
              additionalImagesCount: 0,
              modelConsistency: false,
              sameBackground: false,
            },
          };
        }),

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

      clearProductImages: () =>
        set((state) => ({
          ...state,
          products: sanitizeProductsForRetention(state.products),
        })),

      resetStore: (settingsOverrides = {}) => {
        if (typeof window !== "undefined") {
          localStorage.removeItem(GENERATE_STORAGE_KEY);
        }
        set(createInitialState(settingsOverrides));
      },
    }),
    {
      name: GENERATE_STORAGE_KEY,
      // Use SSR-safe fallback for storage
      storage: createJSONStorage(() => typeof window !== "undefined" ? window.localStorage : null),
      partialize: (state) => ({
        settings: state.settings,
        products: sanitizeProductsForRetention(state.products),
        previousSettings: state.previousSettings,
        previousProducts: state.previousProducts ? sanitizeProductsForRetention(state.previousProducts) : null,
      }),
    },
  ),
);
