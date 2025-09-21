import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /login, /dashboard)
  const pathname = request.nextUrl.pathname

  // Get token from cookies
  const token = request.cookies.get('token')?.value || request.cookies.get('gameToken')?.value

  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/', '/api']
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // If user is trying to access a protected route without token
  if (!isPublicRoute && !token) {
    // Redirect to login page
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If user has token and is trying to access login page, redirect to dashboard
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user has token and is trying to access root, redirect to dashboard
  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Allow the request to continue
  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
