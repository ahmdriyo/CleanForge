import { NextResponse, type NextRequest } from "next/server";

// Routes that require authentication
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/standards",
  "/forge",
  "/mcps",
  "/templates",
  "/docs",
  "/analytics",
  "/activity",
  "/validations",
  "/playground",
  "/marketplace",
  "/settings",
];

// Public routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = ["/login", "/register"];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow Next.js internals and public files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/api/templates" ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$/)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("accessToken")?.value;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const isAuthRoute = AUTH_ROUTES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  // If trying to access protected route without token -> redirect to login
  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If already authenticated and trying to access login/register -> redirect to dashboard
  if (isAuthRoute && token) {
    // We don't verify JWT signature here (Edge runtime); just check presence.
    // Full verification happens in API routes via Firebase Admin.
    // This still prevents logged-in users from seeing login page.
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (except auth check above)
     * - _next/static, _next/image
     * - favicon.ico
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
