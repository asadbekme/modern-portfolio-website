import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";
import { type NextRequest } from "next/server";

/**
 * Middleware for i18n routing and Supabase session refresh
 * 
 * WHY: We need to:
 * 1. Refresh Supabase sessions (handled by updateSession)
 * 2. Handle i18n routing (handled by intlMiddleware)
 * 
 * Note: Admin route protection is handled server-side in the route handlers
 * and layout components for better security and error handling.
 */
const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Refresh Supabase session for all routes
  const supabaseResponse = await updateSession(request);

  // Skip i18n routing for admin and API routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
    return supabaseResponse;
  }

  // Apply i18n routing for public routes
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
