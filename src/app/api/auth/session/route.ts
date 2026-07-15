import { NextRequest, NextResponse } from 'next/server';
import { refreshAndGetUser } from '@/lib/auth/auth';
import { setAuthCookies } from '@/lib/auth/cookies';

/**
 * GET /api/auth/session
 *
 * Combines token refresh and user lookup into a single HTTP call, replacing
 * the two-step  POST /api/auth/refresh -> GET /api/auth/me  pattern used during
 * AuthProvider startup.  The existing /api/auth/refresh and /api/auth/me
 * endpoints are intentionally left untouched.
 *
 * On success: rotates auth cookies and returns { id, name, email, role, isPaid }.
 * On failure: 401 -- client should transition to unauthenticated state.
 */
export async function GET(req: NextRequest) {
  const refreshToken = req.cookies.get('refresh_token')?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { user, accessToken, refreshToken: newRefreshToken } =
      await refreshAndGetUser(refreshToken);

    const res = NextResponse.json({
      id: user.id,
      // name falls back to email -- mirrors the shape returned by /api/auth/me
      name: user.email,
      email: user.email,
      role: user.role,
      isPaid: user.isPaid,
    });

    return setAuthCookies(res, accessToken, newRefreshToken);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
