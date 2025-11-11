import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes protégées qui nécessitent une authentification
const protectedRoutes = ["/dashboard", "/admin", "/library", "/scan"]

// Routes publiques (accessible sans auth)
const publicRoutes = ["/", "/api/auth/login", "/api/auth/register"]

/**
 * Middleware simplifié pour Edge Runtime
 * La validation de session complète est faite côté serveur dans les API routes
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const token = request.cookies.get("authToken")?.value

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some((route) => pathname === route)

  // Si c'est une route protégée et pas de token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Si l'utilisateur a un token et essaie d'accéder à la page de login
  if (pathname === "/" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
