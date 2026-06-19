import { NextResponse } from 'next/server';

const REFRESH_DAYS = Number(process.env.JWT_REFRESH_EXPIRES_IN_DAYS ?? 7);
const REFRESH_MAX_AGE = REFRESH_DAYS * 24 * 60 * 60;

const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

export function setAuthCookies(
  res: NextResponse,
  accessToken: string,
  refreshToken: string
): NextResponse {
  res.cookies.set('access_token', accessToken, { ...cookieOpts, maxAge: 15 * 60 });
  res.cookies.set('refresh_token', refreshToken, { ...cookieOpts, maxAge: REFRESH_MAX_AGE });
  return res;
}

export function clearAuthCookies(res: NextResponse): NextResponse {
  res.cookies.delete('access_token');
  res.cookies.delete('refresh_token');
  return res;
}
