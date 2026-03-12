import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Get cookies
  const locale = request.cookies.get('locale')?.value;
  const geoData = request.cookies.get('geoData')?.value;

  // 2. Define "Safe Zones" (no redirecting)
  // prevents loops and allows API/Images to load correctly
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.includes('.') || 
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 3. Handle NEW visitors at the root (no cookies yet)
  if (pathname === '/' && !locale && !geoData) {
    return NextResponse.redirect(new URL('/api/geo', request.url));
  }

  // 4. Logic for users on Indonesian pages
  if (pathname.startsWith('/id')) {
    // If user manually switched to English but is still on an Indonesian URL
    if (locale === 'en') {
      const cleanPath = pathname.replace(/^\/id/, '') || '/';
      return NextResponse.redirect(new URL(cleanPath, request.url));
    }
    return NextResponse.next();
  }

  // 5. Logic for users on English pages
  // If user wants Indonesian but is on an English URL
  if (locale === 'id') {
    const targetPath = pathname === '/' ? '/id' : `/id${pathname}`;
    return NextResponse.redirect(new URL(targetPath, request.url));
  }

  return NextResponse.next();
}

// Ensure the middleware runs on all relevant paths
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
