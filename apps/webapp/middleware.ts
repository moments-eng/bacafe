import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

interface RouteConfig {
  pattern: RegExp;
  requiresAuth?: boolean;
  requiresApproval?: boolean;
  requiresOnboarding?: boolean;
  redirect: string;
  excludePatterns?: RegExp[];
}

function isSecureCookie() {
  return process.env.AUTH_URL
    ? new URL(process.env.AUTH_URL).protocol === "https:"
    : false;
}

const publicRoutes = [
  "/",
  "/login",
  "/api/auth",
  "/_next",
  "/fonts",
  "/images",
  "/favicon.ico",
];

const routeConfig: RouteConfig[] = [
  {
    pattern: /^\/dashboard/,
    requiresAuth: true,
    requiresApproval: true,
    requiresOnboarding: true,
    redirect: "/login",
    excludePatterns: [/^\/dashboard\/public/],
  },
  {
    pattern: /^\/onboarding/,
    requiresAuth: true,
    redirect: "/login",
    excludePatterns: [/^\/onboarding\/success/],
  },
  {
    pattern: /^\/chat/,
    requiresAuth: true,
    requiresApproval: true,
    requiresOnboarding: true,
    redirect: "/login",
  },
  {
    pattern: /^\/settings/,
    requiresAuth: true,
    requiresApproval: true,
    requiresOnboarding: true,
    redirect: "/login",
  },
];

async function isAuthenticated(request: NextRequest): Promise<{
  isAuth: boolean;
  user?: { approved?: boolean; isOnboardingDone?: boolean };
}> {
  try {
    const token = await getToken({
      req: request,
      secureCookie: isSecureCookie(),
    });
    if (!token) return { isAuth: false };
    return {
      isAuth: true,
      user: token.user as { approved?: boolean; isOnboardingDone?: boolean },
    };
  } catch (error) {
    return { isAuth: false };
  }
}

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => pathname.startsWith(route));
}

function shouldExcludeRoute(
  pathname: string,
  excludePatterns?: RegExp[]
): boolean {
  if (!excludePatterns) return false;
  return excludePatterns.some((pattern) => pattern.test(pathname));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Add health check endpoint
  if (pathname === "/health") {
    return new NextResponse("OK", { status: 200 });
  }

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Find matching route configuration
  const matchedRoute = routeConfig.find(
    (route) =>
      route.pattern.test(pathname) &&
      !shouldExcludeRoute(pathname, route.excludePatterns)
  );

  if (!matchedRoute) {
    return NextResponse.next();
  }

  const { isAuth, user } = await isAuthenticated(request);

  // Handle authentication requirement
  if (matchedRoute.requiresAuth && !isAuth) {
    const redirectUrl = new URL(matchedRoute.redirect, request.url);
    redirectUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Handle approval requirement
  if (matchedRoute.requiresApproval && !user?.approved) {
    return NextResponse.redirect(new URL("/onboarding/success", request.url));
  }

  // Handle onboarding requirement
  if (matchedRoute.requiresOnboarding && !user?.isOnboardingDone) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. Matches any request that starts with:
     *  - api/auth (API routes)
     *  - _next/static (static files)
     *  - _next/image (image optimization files)
     *  - favicon.ico (favicon file)
     *  - images, fonts (public assets)
     * 2. Matches based on the route configurations above
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|images|fonts).*)",
  ],
};
