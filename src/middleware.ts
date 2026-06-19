import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET!);

function loginRedirect(req: NextRequest, pathname: string) {
  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('redirect', pathname);
  return NextResponse.redirect(loginUrl);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const refreshToken = req.cookies.get('refresh_token')?.value;

  if (!refreshToken) {
    return loginRedirect(req, pathname);
  }

  const isDashboard = pathname.startsWith('/dashboard');
  const accessToken = req.cookies.get('access_token')?.value;

  if (isDashboard) {
    if (!accessToken) {
      return loginRedirect(req, pathname);
    }
    try {
      const { payload } = await jwtVerify(accessToken, secret());
      if (payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    } catch {
      return loginRedirect(req, pathname);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/files/:path*', '/payment/:path*'],
};
