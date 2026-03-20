import { supabase } from "@/integrations/supabase/client";
import { useCreditsStore } from "@/hooks/useCreditsStore";
import { useGenerateStore } from "@/hooks/useGenerateStore";

const DEFAULT_BACKEND_URL = "https://ai-api.glamolic.com";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || DEFAULT_BACKEND_URL;

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

export const generateVideo = async (payload) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  if (!token) {
    throw new Error("No authentication token found. Please log in again.");
  }

  const response = await fetch(`${BACKEND_URL}/video-generate`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (response?.status === 401) {
    await handleUnauthorizedError();
    return;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || `Video generation API request failed with status ${response.status}`);
  }

  return response.json();
};
