import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { createClient } from "@/lib/supabase-middleware";

const intlMiddleware = createIntlMiddleware(routing);

function getLocale(pathname: string): string {
  const localeMatch = pathname.match(/^\/(en|ru|uz)/);
  return localeMatch ? localeMatch[1] : "en";
}

function getPathnameWithoutLocale(pathname: string): string {
  return pathname.replace(/^\/(en|ru|uz)/, "") || "/";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = getLocale(pathname);
  const cleanPathname = getPathnameWithoutLocale(pathname);
  const isAdminRoute = cleanPathname.startsWith("/admin");
  const isLoginPage = cleanPathname === "/admin/login";

  // Non-admin routes: only i18n processing needed
  if (!isAdminRoute) {
    return intlMiddleware(request);
  }

  // Create Supabase server client for auth verification.
  // Must run BEFORE intlMiddleware so setAll can update request cookies.
  const auth = createClient(request);

  // getUser() verifies the JWT with the Supabase server (secure).
  // getSession() only reads the JWT from cookies without verification (insecure).
  const {
    data: { user },
  } = await auth.supabase.auth.getUser();

  // Protect admin routes (except login page)
  if (!isLoginPage) {
    if (!user) {
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      loginUrl.searchParams.set("redirect", cleanPathname);
      return NextResponse.redirect(loginUrl);
    }

    const { data: adminUser, error } = await auth.supabase
      .from("admin_users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || !adminUser || adminUser.role !== "admin") {
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      loginUrl.searchParams.set("error", "unauthorized");
      await auth.supabase.auth.signOut();
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated admins away from login page
  if (isLoginPage && user) {
    const { data: adminUser } = await auth.supabase
      .from("admin_users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (adminUser?.role === "admin") {
      const redirectTo =
        request.nextUrl.searchParams.get("redirect") || "/admin";
      return NextResponse.redirect(
        new URL(`/${locale}${redirectTo}`, request.url),
      );
    }
  }

  // Run intl middleware (request cookies are already updated by setAll)
  const intlResponse = intlMiddleware(request);

  // Merge Supabase auth cookies into the intl response.
  // auth.response is a getter that returns the latest reference
  // (after any setAll reassignments during token refresh).
  auth.response.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });

  return intlResponse;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
