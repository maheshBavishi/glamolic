import { supabase } from "@/integrations/supabase/client";

export const regenerateImage = async (payload) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new Error("No authentication token found. Please log in again.");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/regenerate`, {
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
    throw new Error("Unauthorized. Please log in again.");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || `Regenerate API request failed with status ${response.status}`);
  }

  const responseData = await response.json();
  return responseData;
};
