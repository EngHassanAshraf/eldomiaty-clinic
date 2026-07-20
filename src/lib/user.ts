import type { User } from '@/lib/api/types';

/**
 * Derives a human-readable display name from a user record.
 *
 * Priority:
 *   1. user.name  — if set and non-empty
 *   2. email prefix before '@'
 *   3. Fallback: 'User'
 *
 * This is the single authoritative implementation. Import from here in both
 * server and client code; navbar-menu.ts re-exports it for backward compat.
 */
export function getProfileDisplayName(
  user: Pick<User, 'email'> & Partial<Pick<User, 'name'>>
): string {

  const name = typeof user.name === 'string' && user.name.trim() ? user.name.trim() : '';
  if (name) return name;

  const email = user.email?.trim() ?? '';
  if (!email) return 'User';

  return email.split('@')[0];
}
