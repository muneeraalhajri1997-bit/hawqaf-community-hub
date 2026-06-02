import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://rmhodsquodvcabzhqjau.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtaG9kc3F1b2R2Y2FiemhxamF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzOTE4MjksImV4cCI6MjA5Mzk2NzgyOX0.qVHngawWN5wj5IMipgZ5c7b55_p2IhXRAIw1BzddrS8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});
