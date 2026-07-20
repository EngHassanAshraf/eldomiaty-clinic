import { Role } from '@prisma/client';
import { SignJWT, jwtVerify } from 'jose';

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET!);
const EXPIRY = process.env.JWT_EXPIRES_IN ?? '15m';

export type AccessTokenPayload = {
  userId: string;
  name: string;
  email: string;
  role: Role;
  isPaid: boolean;
};

export async function signAccessToken(user: {
  id: string;
  name: string;
  email: string;
  role: Role;
  isPaid: boolean;
}): Promise<string> {
  return new SignJWT({ name: user.name, email: user.email, role: user.role, isPaid: user.isPaid })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(secret());
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload> {
  const { payload } = await jwtVerify(token, secret());
  if (!payload.sub || !payload.name || !payload.email || payload.role === undefined || payload.isPaid === undefined) {
    throw new Error('Invalid token');
  }
  return {
    userId: payload.sub,
    name: payload.name as string,
    email: payload.email as string,
    role: payload.role as Role,
    isPaid: Boolean(payload.isPaid),
  };
}
