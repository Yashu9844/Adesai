import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'admin-session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const isPublicPath = 
    pathname === '/login' || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.includes('.') || // Static files like favicon.ico, images, etc.
    pathname === '/'; // Splash screen is public

  const isAuthenticated = request.cookies.has(SESSION_COOKIE_NAME);

  // If the path is not public and the user is not authenticated, redirect to /login
  if (!isPublicPath && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If the user is authenticated and trying to access the login page, redirect to dashboard
  if (pathname === '/login' && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
