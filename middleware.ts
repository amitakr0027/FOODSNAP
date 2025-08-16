import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define protected routes that require authentication
const protectedRoutes = ["/scan", "/analysis", "/history", "/profile", "/community"]

// Define auth routes that should redirect to home if user is already logged in
const authRoutes = ["/login", "/signup"]

// Define public routes that don't require authentication
const publicRoutes = ["/", "/home", "/about", "/privacy", "/terms", "/contact"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow all public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Get the authentication token from cookies (you'll need to implement this based on your auth setup)
  const token = request.cookies.get("auth-token")?.value

  // If accessing a protected route without authentication
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If accessing auth routes while already authenticated
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/home", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
