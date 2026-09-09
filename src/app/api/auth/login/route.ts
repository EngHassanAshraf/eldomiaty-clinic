import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/lib/auth/auth';
import { setAuthCookies } from '@/lib/auth/cookies';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    const tokens = await login(email, password);
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
    const msg = e instanceof Error ? e.message : 'Invalid credentials';
    if (msg === 'account-disabled') {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
}
