import { cookies } from 'next/headers';
import { verifyAccessToken } from './jwt';
import { User } from '@/lib/api/types';

/**
 * Retrieves the current authenticated user on the server (e.g. for Server Components).
 * Reads the access_token cookie and verifies it.
 * Returns null if the token is missing or invalid.
 */
export async function getServerUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) return null;

  try {
    const payload = await verifyAccessToken(token);
    return {
      id: payload.userId,
      email: payload.email,
      name: payload.name, // displayName fallback
      role: payload.role,
      isPaid: payload.isPaid,
    };
  } catch {
    return null;
  }
}
