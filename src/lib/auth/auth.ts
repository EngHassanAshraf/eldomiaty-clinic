import { Role } from '@prisma/client';
import { prisma } from '@/lib/prisma/client';
import { signAccessToken } from './jwt';
import { hashPassword, verifyPassword } from './password';
import { generateRefreshToken, hashRefreshToken, refreshExpiresAt } from './tokens';

export type AuthTokens = { accessToken: string; refreshToken: string };

export type IssueResult = AuthTokens & {
  user: { id: string; email: string; role: Role; isPaid: boolean };
};

type SessionMeta = { deviceInfo?: string; ipAddress?: string };

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

async function issueTokens(
  user: { id: string; email: string; role: Role; isPaid: boolean },
  meta?: SessionMeta
): Promise<IssueResult> {
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
  return { accessToken, refreshToken, user };
}

type RotateResult = {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; role: Role; isPaid: boolean };
};

/**
 * Core of token rotation: validates the incoming refresh token, deletes the
 * old session, issues a new one, and signs a fresh access token.
 * Returns new tokens together with the full user record so callers that need
 * the user (refreshAndGetUser) don't require a second DB query.
 */
async function rotateSession(
  refreshToken: string,
  meta?: SessionMeta
): Promise<RotateResult> {
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
  return {
    accessToken,
    refreshToken: newRefreshToken,
    user: { id: user.id, email: user.email, role: user.role, isPaid: user.isPaid },
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function register(
  email: string,
  password: string,
  meta?: SessionMeta
): Promise<IssueResult> {
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
): Promise<IssueResult> {
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
  const { accessToken, refreshToken: newRefreshToken } = await rotateSession(refreshToken, meta);
  return { accessToken, refreshToken: newRefreshToken };
}

export type RefreshWithUserResult = AuthTokens & {
  user: { id: string; email: string; role: Role; isPaid: boolean };
};

/**
 * Rotates the refresh token and returns the new tokens together with the user
 * record — all in a single DB roundtrip sequence. This avoids a second HTTP
 * call to /api/auth/me that would otherwise be needed on the client.
 */
export async function refreshAndGetUser(
  refreshToken: string,
  meta?: SessionMeta
): Promise<RefreshWithUserResult> {
  return rotateSession(refreshToken, meta);
}

export async function logout(refreshToken: string): Promise<void> {
  const hash = hashRefreshToken(refreshToken);
  await prisma.userSession.deleteMany({ where: { refreshTokenHash: hash } });
}
