import { NextRequest, NextResponse } from 'next/server';
import { refresh } from '@/lib/auth/auth';
import { setAuthCookies } from '@/lib/auth/cookies';

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get('refresh_token')?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const tokens = await refresh(refreshToken);
    const res = NextResponse.json({ ok: true });
    return setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
