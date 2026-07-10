import { NextRequest, NextResponse } from 'next/server';
import { register } from '@/lib/auth/auth';
import { setAuthCookies } from '@/lib/auth/cookies';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { getSystemSetting, parseAllowRegistrations } from '@/lib/settings/system-settings';

export async function POST(req: NextRequest) {
  try {
    const allow = parseAllowRegistrations(await getSystemSetting('allow_registrations'));
    if (!allow) {
      return NextResponse.json({ error: 'التسجيل غير متاح حالياً' }, { status: 403 });
    }

    const { email, password } = await req.json();
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    const tokens = await register(email, password);
    const user = await verifyAccessToken(tokens.accessToken);
    const res = NextResponse.json({ userId: user.userId, role: user.role, isPaid: user.isPaid });
    return setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Registration failed';
    if (msg === 'Email already registered') {
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}
