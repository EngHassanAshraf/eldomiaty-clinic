import { NextRequest, NextResponse } from 'next/server';
import { logout } from '@/lib/auth/auth';
import { clearAuthCookies } from '@/lib/auth/cookies';

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get('refresh_token')?.value;

  if (refreshToken) {
    try {
      await logout(refreshToken);
    } catch {
      // ignore
    }
  }

  const res = NextResponse.json({ ok: true });
  return clearAuthCookies(res);
}
