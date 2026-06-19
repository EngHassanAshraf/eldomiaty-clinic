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
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_AUTH'; payload: { user: User; accessToken: string } }
  | { type: 'CLEAR_AUTH' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
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
  return { id: data.userId, email, role: data.role, isPaid: data.isPaid };
}

async function fetchCurrentUser(): Promise<User | null> {
  try {
    await authApi.refresh();
  } catch {
    return null;
  }
  try {
    return await authApi.me();
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    accessToken: null,
    isLoading: true,
    isAuthenticated: false,
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
    const restore = async () => {
      const user = await fetchCurrentUser();
      if (user) applySession(user);
      else dispatch({ type: 'CLEAR_AUTH' });
    };
    restore();
  }, [applySession]);

  const login = useCallback(async (email: string, password: string) => {
    await authApi.login(email, password);
    const user = await authApi.me();
    applySession(user);
  }, [applySession]);

  const register = useCallback(async (email: string, password: string) => {
    await authApi.register(email, password);
    const user = await authApi.me();
    applySession(user);
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
    const user = await fetchCurrentUser();
    if (user) applySession(user);
    return user;
  }, [applySession]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible' && state.isAuthenticated) {
        refreshAuth();
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [state.isAuthenticated, refreshAuth]);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
