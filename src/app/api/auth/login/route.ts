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
      name:tokens.user.name,
      role: tokens.user.role,
      isPaid: tokens.user.isPaid,
    });
    return setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
  } catch {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
}
