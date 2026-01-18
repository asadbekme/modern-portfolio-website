import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { createClient } from "@/lib/supabase-middleware";

// Create i18n middleware
const intlMiddleware = createIntlMiddleware(routing);

// Helper functions
function getLocale(pathname: string): string {
  const localeMatch = pathname.match(/^\/(en|ru|uz)/);
  return localeMatch ? localeMatch[1] : "en";
}

function getPathnameWithoutLocale(pathname: string): string {
  return pathname.replace(/^\/(en|ru|uz)/, "") || "/";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract locale and clean pathname
  const locale = getLocale(pathname);
  const cleanPathname = getPathnameWithoutLocale(pathname);

  // Check if this is an admin route
  const isAdminRoute = cleanPathname.startsWith("/admin");
  const isLoginPage = cleanPathname === "/admin/login";

  // 1. Handle i18n first
  let response = intlMiddleware(request);

  // 2. If not admin route, return i18n response
  if (!isAdminRoute) {
    return response;
  }

  // 3. Handle admin authentication
  const { supabase, response: authResponse } = createClient(request);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 4. Protect admin routes (except login page)
  if (!isLoginPage) {
    if (!session) {
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      loginUrl.searchParams.set("redirect", cleanPathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user is admin
    const { data: adminUser, error } = await supabase
      .from("admin_users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (error || !adminUser || adminUser.role !== "admin") {
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      loginUrl.searchParams.set("error", "unauthorized");
      await supabase.auth.signOut();
      return NextResponse.redirect(loginUrl);
    }
  }

  // 5. Redirect authenticated admins away from login page
  if (isLoginPage && session) {
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (adminUser?.role === "admin") {
      const redirectTo =
        request.nextUrl.searchParams.get("redirect") || "/admin";
      return NextResponse.redirect(
        new URL(`/${locale}${redirectTo}`, request.url),
      );
    }
  }

  // 6. Merge auth cookies into i18n response
  authResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value);
  });

  return response;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
