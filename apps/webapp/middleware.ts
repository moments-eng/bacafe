import NextAuth from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  // Skip auth check for health check and auth endpoints
  const url = new URL(req.url || "");
  const path = url.pathname;
  if (req.method === "GET" && path === "/health") {
    return NextResponse.json({ message: "OK" });
  }

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.AUTH_URL
      ? new URL(process.env.AUTH_URL).protocol === "https:"
      : false,
  });

  // Skip auth check for auth-related endpoints
  if (path.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Only apply auth rules to dashboard routes
  if (!path.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (path.startsWith("/dashboard/onboarding")) {
    if (token.isOnboardingDone) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (!token.approved) {
    if (path !== "/dashboard/approval-pending") {
      return NextResponse.redirect(
        new URL("/dashboard/approval-pending", req.url)
      );
    }
    return NextResponse.next();
  }

  if (!token.isOnboardingDone && path !== "/dashboard/onboarding") {
    return NextResponse.redirect(new URL("/dashboard/onboarding", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
