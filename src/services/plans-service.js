import { supabaseClient } from "@/integrations/supabase/supabaseClient";

const CURRENCY_SYMBOL_MAP = {
  INR: "\u20B9",
  USD: "$",
  EUR: "\u20AC",
  GBP: "\u00A3",
};

const DEFAULT_FEATURES = [
  "All categories access",
  "Up to 4K resolution",
  "Premium backgrounds",
  "Model consistency",
  "Background consistency",
  "Priority support",
];

const parseFeatures = (features) => {
  if (Array.isArray(features)) {
    return features.map((feature) => String(feature || "").trim()).filter(Boolean);
  }

  if (typeof features === "string") {
    const cleaned = features.trim();
    if (!cleaned) return [];

    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        return parsed.map((feature) => String(feature || "").trim()).filter(Boolean);
      }
    } catch {
      // Fallback to comma-separated values.
    }

    return cleaned
      .split(",")
      .map((feature) => feature.trim())
      .filter(Boolean);
  }

  return [];
};

export const normalizePlanCategory = (category) => {
  const normalized = String(category || "")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_")
    .replace(/\s+/g, "_");

  if (normalized.includes("ecom")) return "ecommerce";
  if (normalized.includes("end_user") || normalized.includes("enduser")) return "end_user";
  if (normalized.includes("regular")) return "regular";

  return normalized;
};

export const getPlanName = (displayName) => {
  const cleaned = String(displayName || "").trim();
  if (!cleaned) return "Plan";

  const enDash = "\u2013";
  const withEnDashSplit = cleaned.split(enDash)[0].trim();
  return withEnDashSplit.split("-")[0].trim() || cleaned;
};

export const formatPrice = (price, currencyType) => {
  const amount = Number(price);
  if (Number.isNaN(amount)) {
    return String(price || "");
  }

  const currencyKey = String(currencyType || "").toUpperCase();
  const symbol = CURRENCY_SYMBOL_MAP[currencyKey] || (currencyKey ? `${currencyKey} ` : "");
  const locale = currencyKey === "INR" ? "en-IN" : "en-US";

  return `${symbol}${amount.toLocaleString(locale)}`;
};

export const generatePlanFeatures = (plan) => {
  const parsedFeatures = parseFeatures(plan?.features);
  if (parsedFeatures.length > 0) return parsedFeatures;

  const credits = Number.parseInt(String(plan?.credits || "0"), 10);
  const safeCredits = Number.isNaN(credits) ? 0 : credits;

  return [`${safeCredits} image credits`, ...DEFAULT_FEATURES];
};

export async function fetchPlansByCategory() {
  const baseQuery = supabaseClient.from("plans").select("*").order("price", { ascending: true });

  const primaryResponse = await baseQuery.eq("mode", "PROD");
  if (!primaryResponse.error && Array.isArray(primaryResponse.data) && primaryResponse.data.length > 0) {
    return primaryResponse.data;
  }

  const fallbackResponse = await supabaseClient.from("plans").select("*").order("price", { ascending: true });
  if (fallbackResponse.error) {
    console.error("Error fetching plans:", fallbackResponse.error);
    throw new Error("Failed to fetch plans");
  }

  return Array.isArray(fallbackResponse.data) ? fallbackResponse.data : [];
}
