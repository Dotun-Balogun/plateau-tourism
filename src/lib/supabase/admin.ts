import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database.types";

/**
 * Admin client using the service-role key. Bypasses Row Level Security.
 *
 * ⚠️ NEVER import this file in a Client Component or expose it to the
 * browser. Use only inside Server Actions, Route Handlers, or trusted
 * server-side jobs (e.g. webhooks, cron/edge functions).
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
