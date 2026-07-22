import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/src/lib/env";
import type { Database } from "@/src/types/database";

export function createClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
