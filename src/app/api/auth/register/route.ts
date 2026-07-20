import { NextRequest, NextResponse } from 'next/server';
import { register } from '@/lib/auth/auth';
import { setAuthCookies } from '@/lib/auth/cookies';
import { getSystemSetting, parseAllowRegistrations } from '@/lib/settings/system-settings';

export async function POST(req: NextRequest) {
  try {
    const allow = parseAllowRegistrations(await getSystemSetting('allow_registrations'));
    if (!allow) {
      return NextResponse.json({ error: 'التسجيل غير متاح حالياً' }, { status: 403 });
    }

    const { name, email, password, confirmPassword} = await req.json();
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    const tokens = await register(name, email, password, confirmPassword);
    const res = NextResponse.json({
      userId: tokens.user.id,
      name:tokens.user.name,
      role: tokens.user.role,
      isPaid: tokens.user.isPaid,
    });
    return setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Registration failed';
    if (msg === 'Email already registered') {
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}
