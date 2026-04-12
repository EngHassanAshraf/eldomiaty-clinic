import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { refreshToken } = await req.json();

  if (!refreshToken) {
    return NextResponse.json({ error: 'Missing refreshToken' }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  return response;
}
