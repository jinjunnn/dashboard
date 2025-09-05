import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/database/config";

export function createSupabaseServerClient() {
  const config = getSupabaseConfig();

  return createClient(config.url, config.key);
}
