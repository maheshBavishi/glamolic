import { supabase } from "@/integrations/supabase/client";
import { useCreditsStore } from "@/hooks/useCreditsStore";
import { useGenerateStore } from "@/hooks/useGenerateStore";

const DEFAULT_BACKEND_URL = "https://ai-api.glamolic.com";

const normalizeBaseUrl = (value) =>
  String(value || "")
    .trim()
    .replace(/^["']+|["']+$/g, "")
    .replace(/\/+$/, "");

const handleUnauthorizedError = async () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("session_expired", "true");
    localStorage.removeItem("generate-storage");
  }
  useGenerateStore.getState().resetStore();
  useCreditsStore.getState().resetCredits();
  await supabase.auth.signOut();
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
};

export const regenerateImage = async (payload) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  if (!token) {
    throw new Error("No authentication token found. Please log in again.");
  }

  const baseUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_BACKEND_URL) || DEFAULT_BACKEND_URL;
  const requestUrl = `${baseUrl}/regenerate`;

  const updatedPayload = {
    ...payload,
    low_cost: false,
  };

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify(updatedPayload),
  });

  if (response?.status === 401) {
    await handleUnauthorizedError();
    return;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    let errorMessage = errorData.detail || errorData.message || `Regenerate API request failed (${response.status}) at ${requestUrl}`;
    if (typeof errorMessage === "string" && errorMessage.includes("[Wavespeed Fallback] Task completed but no valid output found")) {
      errorMessage = "Our models are experiencing high demand. Please try again later.";
    }
    throw new Error(errorMessage);
  }

  return response.json();
};
