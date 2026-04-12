'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { User } from '@/lib/api/types';
import { authApi } from '@/lib/api/auth';
import { setClientToken, setClientClearAuth } from '@/lib/api/client';
import { useRouter } from 'next/navigation';

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
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    accessToken: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const clearAuth = useCallback(() => {
    dispatch({ type: 'CLEAR_AUTH' });
    setClientToken(null);
  }, []);

  // Register clearAuth with the API client so it can clear state on 401
  useEffect(() => {
    setClientClearAuth(clearAuth);
  }, [clearAuth]);

  // Restore session on mount
  useEffect(() => {
    const restore = async () => {
      try {
        const res = await fetch('/api/auth/refresh');
        if (res.ok) {
          const { accessToken } = await res.json();
          // Decode user from token (base64 decode the payload)
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          const user: User = {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
            isPaid: payload.isPaid ?? false,
          };
          dispatch({ type: 'SET_AUTH', payload: { user, accessToken } });
          setClientToken(accessToken);
        } else {
          dispatch({ type: 'CLEAR_AUTH' });
        }
      } catch {
        dispatch({ type: 'CLEAR_AUTH' });
      }
    };
    restore();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    // Store refresh token in httpOnly cookie
    await fetch('/api/auth/set-cookie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: data.refreshToken }),
    });
    // Decode user from access token
    const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
    const user: User = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      isPaid: payload.isPaid ?? false,
    };
    dispatch({ type: 'SET_AUTH', payload: { user, accessToken: data.accessToken } });
    setClientToken(data.accessToken);
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const data = await authApi.register(email, password);
    await fetch('/api/auth/set-cookie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: data.refreshToken }),
    });
    const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
    const user: User = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      isPaid: payload.isPaid ?? false,
    };
    dispatch({ type: 'SET_AUTH', payload: { user, accessToken: data.accessToken } });
    setClientToken(data.accessToken);
  }, []);

  const logout = useCallback(async () => {
    clearAuth();
    await fetch('/api/auth/clear-cookie', { method: 'POST' });
    router.push('/');
  }, [clearAuth, router]);

  const refreshAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/refresh');
      if (res.ok) {
        const { accessToken } = await res.json();
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const user: User = {
          id: payload.sub,
          email: payload.email,
          role: payload.role,
          isPaid: payload.isPaid ?? false,
        };
        dispatch({ type: 'SET_AUTH', payload: { user, accessToken } });
        setClientToken(accessToken);
      }
    } catch {
      // silently fail
    }
  }, []);

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
