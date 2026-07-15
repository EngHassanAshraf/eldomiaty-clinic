'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { User } from '@/lib/api/types';
import { authApi, AuthUserResponse } from '@/lib/api/auth';
import { setClientToken, setClientClearAuth } from '@/lib/api/client';
import { useRouter } from 'next/navigation';

const COOKIE_SESSION = 'cookie';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: 'SET_AUTH'; payload: { user: User; accessToken: string } }
  | { type: 'CLEAR_AUTH' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        isLoading: false,
        isAuthenticated: true,
      };
    case 'CLEAR_AUTH':
      return { user: null, accessToken: null, isLoading: false, isAuthenticated: false };
    default:
      return state;
  }
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toUser(data: AuthUserResponse, email: string): User {
  return { id: data.userId, name: email, email, role: data.role, isPaid: data.isPaid };
}



export function AuthProvider({
  children,
  initialUser = null,
  initialHasRefreshCookie = false,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
  initialHasRefreshCookie?: boolean;
}) {
  const router = useRouter();
  const [state, dispatch] = useReducer(authReducer, {
    user: initialUser,
    accessToken: initialUser ? COOKIE_SESSION : null,
    isLoading: initialUser ? false : initialHasRefreshCookie,
    isAuthenticated: !!initialUser,
  });

  const applySession = useCallback((user: User) => {
    dispatch({ type: 'SET_AUTH', payload: { user, accessToken: COOKIE_SESSION } });
    setClientToken(COOKIE_SESSION);
  }, []);

  const clearAuth = useCallback(() => {
    dispatch({ type: 'CLEAR_AUTH' });
    setClientToken(null);
  }, []);

  useEffect(() => {
    setClientClearAuth(clearAuth);
  }, [clearAuth]);

  useEffect(() => {
    // If SSR provided the user, we're already authenticated and loading is false.
    // Just sync the client module state and we are done.
    if (initialUser) {
      setClientToken(COOKIE_SESSION);
      return;
    }

    // Fast path for unauthenticated visitors: check the cookie state synchronously so
    // we can dispatch CLEAR_AUTH in the same microtask — no network call needed.
    if (!initialHasRefreshCookie) {
      dispatch({ type: 'CLEAR_AUTH' });
      return;
    }
    // Authenticated path: call the combined session endpoint (1 RTT).
    void (async () => {
      try {
        const res = await fetch('/api/auth/session', { credentials: 'include' });
        if (!res.ok) {
          dispatch({ type: 'CLEAR_AUTH' });
          return;
        }
        const user = await res.json() as User;
        applySession(user);
      } catch {
        dispatch({ type: 'CLEAR_AUTH' });
      }
    })();
  }, [initialUser, applySession, initialHasRefreshCookie]);

  const login = useCallback(async (email: string, password: string) => {
    // authApi.login() already returns { userId, role, isPaid }.
    // The email is our parameter — toUser() assembles the full User with no
    // extra round-trip needed.
    const data = await authApi.login(email, password);
    applySession(toUser(data, email));
  }, [applySession]);

  const register = useCallback(async (email: string, password: string) => {
    // Same reasoning as login(): authApi.register() returns AuthUserResponse
    // and email is already in scope — no need to call me() again.
    const data = await authApi.register(email, password);
    applySession(toUser(data, email));
  }, [applySession]);

  const logout = useCallback(async () => {
    clearAuth();
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    router.push('/');
  }, [clearAuth, router]);

  const refreshAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session', { credentials: 'include' });
      if (!res.ok) return null;
      const user = await res.json() as User;
      applySession(user);
      return user;
    } catch {
      return null;
    }
  }, [applySession]);

  useEffect(() => {
    const handleAuthExpired = () => {
      clearAuth();
      router.push('/login');
    };
    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, [clearAuth, router]);

  // Opt: Memoize the context value to prevent unnecessary re-renders of all
  // consumers (like Navbar) if AuthProvider happens to re-render from its parent.
  // This provides measurable value by cutting off global render cascades.
  const contextValue = React.useMemo(
    () => ({ ...state, login, register, logout, refreshAuth }),
    [state, login, register, logout, refreshAuth]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
