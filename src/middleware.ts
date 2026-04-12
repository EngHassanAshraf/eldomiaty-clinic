import { NextRequest, NextResponse } from 'next/server';
import { decodeJwt } from 'jose';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const refreshToken = req.cookies.get('refresh_token')?.value;

  // If no refresh token cookie, redirect to login
  if (!refreshToken) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For dashboard routes, check role from access_token cookie if present
  if (pathname.startsWith('/dashboard')) {
    const accessToken = req.cookies.get('access_token')?.value;
    if (accessToken) {
      try {
        const payload = decodeJwt(accessToken);
        if (payload.role !== 'ADMIN') {
          return NextResponse.redirect(new URL('/', req.url));
        }
      } catch {
        // Token decode failed — allow through (server will enforce)
      }
    }
    // If no access token cookie, allow through — AuthContext will handle role check
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/files/:path*', '/payment/:path*'],
};
