export const CREDITS_PER_IMAGE = {
  "1k": 1,
  "2k": 2,
  "4k": 3,
};

export const VIEW_ORDER = ["front", "back", "left", "right", "close_up"];
export const IMAGE_FIELD_KEYS = ["frontImage", "backImage", "topImage", "bottomImage", "blouseImage", "dupattaImage", "bottomBackImage"];

export const resolutionOptions = [
  { value: "1k", label: "1K" },
  { value: "2k", label: "2K" },
  { value: "4k", label: "4K" },
];

export const imageOrientationOptions = [
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
];

export const portraitImageSizeOptions = [
  { value: "6x9", label: "6 × 9 inch" },
  { value: "9x12", label: "9 × 12 inch" },
  { value: "11x15", label: "11 × 15 inch" },
  { value: "11x17", label: "11 × 17 inch" },
  { value: "12x16", label: "12 × 16 inch" },
  { value: "12x18", label: "12 × 18 inch" },
  { value: "13x20", label: "13 × 20 inch" },
  { value: "24x36", label: "24 × 36 inch" },
];

export const landscapeImageSizeOptions = [
  { value: "9x6", label: "9 x 6 inch" },
  { value: "18x12", label: "18 x 12 inch" },
  { value: "36x24", label: "36 x 24 inch" },
];

export const imagesPerProductOptions = [
  { value: 1, label: "1 image per product" },
  { value: 2, label: "2 images per product" },
  { value: 4, label: "4 images per product" },
];

export const backgroundTypeOptions = [
  { value: "solid_white", label: "Solid White" },
  { value: "solid_black", label: "Solid Black" },
  { value: "studio", label: "Professional Studio" },
  { value: "gradient", label: "Gradient" },
  { value: "lifestyle", label: "Lifestyle (Outdoor)" },
];

export const ecommerceViewOptions = [
  { value: "front", label: "Front" },
  { value: "back", label: "Back" },
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
  { value: "close_up", label: "Close up" },
];
