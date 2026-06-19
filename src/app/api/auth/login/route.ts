import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/lib/auth/auth';
import { setAuthCookies } from '@/lib/auth/cookies';
import { verifyAccessToken } from '@/lib/auth/jwt';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    const tokens = await login(email, password);
    const user = await verifyAccessToken(tokens.accessToken);
    const res = NextResponse.json({ userId: user.userId, role: user.role, isPaid: user.isPaid });
    return setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
  } catch {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
}
