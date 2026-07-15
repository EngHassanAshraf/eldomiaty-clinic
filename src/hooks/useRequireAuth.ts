'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import type { User } from '@/lib/api/types';

interface RequireAuthOptions {
  /** Redirect destination when the guard fails. Defaults to '/login'. */
  redirectTo?: string;
  /**
   * Optional role check. When provided, authenticated users who don't hold
   * this role are also redirected.
   */
  requiredRole?: User['role'];
  /**
   * Use router.replace instead of router.push so the guarded page is not
   * added to the browser history. Defaults to true.
   */
  replace?: boolean;
}

/**
 * Redirects unauthenticated (or insufficiently-privileged) users away from a
 * protected page once the auth state has resolved.
 *
 * Returns `{ isLoading, user }` so callers can gate their render on the same
 * values without a second `useAuth()` call.
 *
 * Usage:
 *   const { isLoading, user } = useRequireAuth();
 *   const { isLoading, user } = useRequireAuth({ requiredRole: 'ADMIN', redirectTo: '/' });
 */
export function useRequireAuth(options: RequireAuthOptions = {}) {
  const { redirectTo = '/login', requiredRole, replace = true } = options;
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const authed = isAuthenticated && !!user;
    const roleOk = !requiredRole || user?.role === requiredRole;

    if (!authed || !roleOk) {
      if (replace) {
        router.replace(redirectTo);
      } else {
        router.push(redirectTo);
      }
    }
  }, [isLoading, isAuthenticated, user, requiredRole, redirectTo, replace, router]);

  return { isLoading, user };
}
