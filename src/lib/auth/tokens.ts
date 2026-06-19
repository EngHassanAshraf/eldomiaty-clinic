import { createHash, randomBytes } from 'crypto';

const REFRESH_DAYS = Number(process.env.JWT_REFRESH_EXPIRES_IN_DAYS ?? 7);

export function generateRefreshToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function refreshExpiresAt(): Date {
  const d = new Date();
  d.setDate(d.getDate() + REFRESH_DAYS);
  return d;
}
