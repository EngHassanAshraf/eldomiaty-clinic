import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET!);

function loginRedirect(req: NextRequest, pathname: string) {
  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('redirect', pathname);
  return NextResponse.redirect(loginUrl);
}

function isStaticAssetPath(pathname: string) {
  return (
    pathname.startsWith('/_next/') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  );
}

async function isMaintenanceEnabled(req: NextRequest): Promise<boolean> {
  try {
    const url = new URL('/api/settings/maintenance', req.url);
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) return false;
    const data = (await res.json().catch(() => null)) as null | { enabled?: unknown };
    return Boolean(data && data.enabled === true);
  } catch {
    // Fail open: if settings cannot be loaded, do not lock everyone out.
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow these paths.
  if (isStaticAssetPath(pathname)) return NextResponse.next();
  if (pathname === '/maintenance') return NextResponse.next();
  if (pathname.startsWith('/api/auth/')) return NextResponse.next();
  if (pathname === '/api/settings/maintenance') return NextResponse.next();

  // Maintenance mode enforcement.
  const maintenanceEnabled = await isMaintenanceEnabled(req);
  if (maintenanceEnabled) {
    const accessToken = req.cookies.get('access_token')?.value;
    if (!accessToken) {
      return NextResponse.redirect(new URL('/maintenance', req.url));
    }
    try {
      const { payload } = await jwtVerify(accessToken, secret());
      if (payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/maintenance', req.url));
      }
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/maintenance', req.url));
    }
  }

  const isProtectedPage =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/files') ||
    pathname.startsWith('/payment');

  if (!isProtectedPage) {
    return NextResponse.next();
  }

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
  matcher: [
    // Apply maintenance enforcement globally (excluding static/_next via code above).
    '/:path*',
  ],
};
