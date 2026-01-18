import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for client-side usage (React components)
 * 
 * WHY: We use @supabase/ssr for proper cookie-based session management
 * in Next.js App Router. This ensures authentication state persists
 * across page navigations and refreshes.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
