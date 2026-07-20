import { apiFetch } from './client';
import { ApiError } from './types';

export type AuthUserResponse = {
  userId: string;
  name: string;
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

  register: (name: string, email: string, password: string, confirmPassword: string) =>
    apiFetch<AuthUserResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({name, email, password, confirmPassword}),
      skipAuth: true,
    }),

  refresh: () =>
    apiFetch<{ ok: true }>('/auth/refresh', { method: 'POST', skipAuth: true }),

  logout: () =>
    apiFetch<{ ok: true }>('/auth/logout', { method: 'POST', skipAuth: true }),
};

// Re-export ApiError so existing consumers that import it from here continue to work.
export { ApiError };
