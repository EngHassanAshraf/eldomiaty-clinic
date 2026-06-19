import { ApiError, User } from './types';

export type AuthUserResponse = {
  userId: string;
  role: 'ADMIN' | 'USER';
  isPaid: boolean;
};

async function authFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers as Record<string, string>) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error || 'Request failed', res.status);
  return data as T;
}

export const authApi = {
  login: (email: string, password: string) =>
    authFetch<AuthUserResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string) =>
    authFetch<AuthUserResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  refresh: () => authFetch<{ ok: true }>('/api/auth/refresh', { method: 'POST' }),

  me: () => authFetch<User>('/api/auth/me'),

  logout: () => authFetch<{ ok: true }>('/api/auth/logout', { method: 'POST' }),
};
