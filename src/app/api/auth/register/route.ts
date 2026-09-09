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

    const { name, email, phone, password, confirmPassword} = await req.json();
    if (
      !email ||
      !password ||
      !phone ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      typeof phone !== 'string'
    ) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    const tokens = await register(name, email, phone, password, confirmPassword);
    const res = NextResponse.json({
      userId: tokens.user.id,
      name: tokens.user.name,
      phone: tokens.user.phone,
      emailVerified: tokens.user.emailVerified,
      phoneVerified: tokens.user.phoneVerified,
      role: tokens.user.role,
      isPaid: tokens.user.isPaid,
      isActive: tokens.user.isActive,
    });
    return setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Registration failed';
    if (msg === 'exist' || msg === 'Email already registered' || msg === 'invalid-phone') {
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}
