import { apiFetch } from './client';
import { ApiError, User } from './types';

export type AuthUserResponse = {
  userId: string;
  role: 'ADMIN' | 'USER';
  isPaid: boolean;
};

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<AuthUserResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    }),

  register: (email: string, password: string) =>
    apiFetch<AuthUserResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    }),

  refresh: () =>
    apiFetch<{ ok: true }>('/auth/refresh', { method: 'POST', skipAuth: true }),

  me: () => apiFetch<User>('/auth/me'),

  logout: () =>
    apiFetch<{ ok: true }>('/auth/logout', { method: 'POST', skipAuth: true }),
};

// Re-export ApiError so existing consumers that import it from here continue to work.
export { ApiError };
