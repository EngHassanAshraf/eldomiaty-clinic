import { Role } from '@prisma/client';
import { NextRequest } from 'next/server';
import { verifyAccessToken, AccessTokenPayload } from './jwt';

function getToken(req: NextRequest): string | null {
  return (
    req.cookies.get('access_token')?.value ??
    req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ??
    null
  );
}

export async function requireAuth(req: NextRequest): Promise<AccessTokenPayload> {
  const token = getToken(req);
  if (!token) throw new Error('Unauthorized');
  return verifyAccessToken(token);
}

export async function requireAdmin(req: NextRequest): Promise<AccessTokenPayload> {
  const user = await requireAuth(req);
  if (user.role !== Role.ADMIN) throw new Error('Forbidden');
  return user;
}
