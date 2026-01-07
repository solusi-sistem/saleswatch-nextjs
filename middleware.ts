import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Jika akses root, redirect ke locale
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Cek apakah pathname sudah dimulai dengan locale
  const pathnameHasLocale = pathname.startsWith('/en') || pathname.startsWith('/id');

  // Jika belum ada locale dan bukan file static, redirect ke /en atau /id
  if (!pathnameHasLocale && !pathname.includes('.')) {
    // Bisa detect dari cookie atau header untuk default locale
    const locale = 'en'; // default
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};