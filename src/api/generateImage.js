import { supabase } from "@/integrations/supabase/client";
import { useCreditsStore } from "@/hooks/useCreditsStore";
import { useGenerateStore } from "@/hooks/useGenerateStore";

const DEFAULT_BACKEND_URL = "https://ai-api.glamolic.com/api";

const normalizeBaseUrl = (value) => String(value || "").trim().replace(/\/+$/, "");

const getBackendBaseUrls = () => {
  const envUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_BACKEND_URL);
  const fallbackUrl = normalizeBaseUrl(DEFAULT_BACKEND_URL);
  return [...new Set([envUrl, fallbackUrl].filter(Boolean))];
};

const shouldTryNextUrl = (response) => [404, 502, 503, 504].includes(response.status);

const fetchWithFallback = async (path, options) => {
  const baseUrls = getBackendBaseUrls();
  let lastNetworkError = null;

  for (let index = 0; index < baseUrls.length; index += 1) {
    const baseUrl = baseUrls[index];
    const requestUrl = `${baseUrl}${path}`;

    try {
      const response = await fetch(requestUrl, options);

      if (!response.ok && shouldTryNextUrl(response) && index < baseUrls.length - 1) {
        continue;
      }

      return { response, requestUrl, triedUrls: baseUrls };
    } catch (error) {
      lastNetworkError = error;

      if (index < baseUrls.length - 1) {
        continue;
      }
    }
  }

  throw new Error(
    `Failed to fetch ${path}. Tried: ${baseUrls.join(", ")}${lastNetworkError?.message ? `. ${lastNetworkError.message}` : ""}`,
  );
};

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

export const generateImage = async (payload) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  if (!token) {
    throw new Error("No authentication token found. Please log in again.");
  }

  const { response, requestUrl } = await fetchWithFallback("/generate", {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify(payload),
  });

  if (response?.status === 401) {
    await handleUnauthorizedError();
    return;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || `API request failed (${response.status}) at ${requestUrl}`);
  }

  return response.json();
};
