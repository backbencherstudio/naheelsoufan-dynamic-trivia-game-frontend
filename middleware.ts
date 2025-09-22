import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
let defaultLocale = "en";
let locales = ["bn", "en"];

function getLocale(request: NextRequest) {
  const acceptedLanguage = request.headers.get("accept-language") ?? undefined;
  let headers = { "accept-language": acceptedLanguage };
  let languages = new Negotiator({ headers }).languages();

  return match(languages, locales, defaultLocale); // -> 'en-US'
}
export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /login, /dashboard, /en/login, /bn/dashboard)
  const pathname = request.nextUrl.pathname

  // Extract locale from pathname (e.g., /en/login -> /login, /bn/dashboard -> /dashboard)
  const locales = ['en', 'bn'];
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );


  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    return NextResponse.redirect(
      new URL(`/${locale}/${pathname}`, request.url)
    );
  }
  
  // Remove locale from pathname for route checking
  const pathnameWithoutLocale = pathnameHasLocale 
    ? pathname.replace(/^\/[a-z]{2}/, '') || '/'
    : pathname;

  // Get token from cookies
  const token = request.cookies.get('token')?.value || request.cookies.get('gameToken')?.value

  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/', '/api']
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathnameWithoutLocale.startsWith(route))

  // If user is trying to access a protected route without token
  if (!isPublicRoute && !token) {
    // Redirect to login page with locale
    const locale = pathnameHasLocale ? pathname.split('/')[1] : 'en';
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
  }

  // If user has token and is trying to access login page, redirect to dashboard
  if (pathnameWithoutLocale === '/login' && token) {
    const locale = pathnameHasLocale ? pathname.split('/')[1] : 'en';
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
  }

  // If user has token and is trying to access root, redirect to dashboard
  if (pathnameWithoutLocale === '/' && token) {
    const locale = pathnameHasLocale ? pathname.split('/')[1] : 'en';
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
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
      "/((?!api|assets|.*\\..*|_next).*)",
  ],
}
