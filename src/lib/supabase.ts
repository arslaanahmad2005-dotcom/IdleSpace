import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function getSupabaseClient(): SupabaseClient {
  // In SSR / build environments import.meta.env may be empty.
  // Return a lazy client that only throws at actual call-time if env is missing.
  const url =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) || "";
  const key =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY) || "";

  if (!url || !key) {
    // During SSR / build we cannot create a real client.
    // Return a placeholder that will be replaced on the client side.
    if (typeof window === "undefined") {
      // Server-side: return a no-op client to avoid build crashes.
      // Auth context only runs on the client, so this is safe.
      return createClient("https://placeholder.supabase.co", "placeholder");
    }
    throw new Error(
      "Missing Supabase environment variables. " +
        "Copy .env.example to .env and fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    );
  }

  return createClient(url, key);
}

export const supabase = getSupabaseClient();
