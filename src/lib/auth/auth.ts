import { Role } from '@prisma/client';
import { prisma } from '@/lib/prisma/client';
import { signAccessToken } from './jwt';
import { hashPassword, verifyPassword } from './password';
import { generateRefreshToken, hashRefreshToken, refreshExpiresAt } from './tokens';

export type AuthTokens = { accessToken: string; refreshToken: string };

type SessionMeta = { deviceInfo?: string; ipAddress?: string };

async function issueTokens(
  user: { id: string; role: Role; isPaid: boolean },
  meta?: SessionMeta
): Promise<AuthTokens> {
  const refreshToken = generateRefreshToken();
  await prisma.userSession.create({
    data: {
      userId: user.id,
      refreshTokenHash: hashRefreshToken(refreshToken),
      expiresAt: refreshExpiresAt(),
      deviceInfo: meta?.deviceInfo,
      ipAddress: meta?.ipAddress,
    },
  });
  const accessToken = await signAccessToken(user);
  return { accessToken, refreshToken };
}

export async function register(
  email: string,
  password: string,
  meta?: SessionMeta
): Promise<AuthTokens> {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('Email already registered');

  const user = await prisma.user.create({
    data: { email, passwordHash: await hashPassword(password), role: Role.USER },
  });
  return issueTokens(user, meta);
}

export async function login(
  email: string,
  password: string,
  meta?: SessionMeta
): Promise<AuthTokens> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw new Error('Invalid credentials');
  }
  return issueTokens(user, meta);
}

export async function refresh(
  refreshToken: string,
  meta?: SessionMeta
): Promise<AuthTokens> {
  const session = await prisma.userSession.findUnique({
    where: { refreshTokenHash: hashRefreshToken(refreshToken) },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date()) {
    if (session) await prisma.userSession.delete({ where: { id: session.id } });
    throw new Error('Invalid refresh token');
  }

  const { user } = session;
  await prisma.userSession.delete({ where: { id: session.id } });

  const newRefreshToken = generateRefreshToken();
  await prisma.userSession.create({
    data: {
      userId: user.id,
      refreshTokenHash: hashRefreshToken(newRefreshToken),
      expiresAt: refreshExpiresAt(),
      deviceInfo: meta?.deviceInfo ?? session.deviceInfo,
      ipAddress: meta?.ipAddress ?? session.ipAddress,
      lastActivityAt: new Date(),
    },
  });

  const accessToken = await signAccessToken(user);
  return { accessToken, refreshToken: newRefreshToken };
}

export async function logout(refreshToken: string): Promise<void> {
  const hash = hashRefreshToken(refreshToken);
  await prisma.userSession.deleteMany({ where: { refreshTokenHash: hash } });
}
