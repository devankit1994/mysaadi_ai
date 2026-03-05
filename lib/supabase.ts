import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Server-only helper for API routes / server actions.
 *
 * IMPORTANT:
 * - Requires `SUPABASE_SERVICE_ROLE_KEY` (do not expose as NEXT_PUBLIC_*)
 * - Do not call this from client components.
 */
export function createSupabaseAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error(
      "createSupabaseAdminClient() must only be used on the server",
    );
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
