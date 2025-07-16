import { supabase } from "@/integrations/supabase/client";

export const apiClient = async (
  path: string,
  options: RequestInit = {}
): Promise<any> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(!isFormData && { "Content-Type": "application/json" }),
  };

  const res = await fetch(`https://feelings-detector.onrender.com${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMessage = "Request failed";

    try {
      const err = await res.json();
      errorMessage = err.detail || err.message || errorMessage;
    } catch (_) {
      // fallback for non-JSON errors
      errorMessage = `${res.status} ${res.statusText}`;
    }

  throw new Error(errorMessage);
}

  return res.json();
};
