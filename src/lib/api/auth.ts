import { apiFetch } from './client';
import type { User } from './types';

export type AuthUserResponse = {
  userId: string;
  name: string;
  phone: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: 'ADMIN' | 'USER';
  isPaid: boolean;
  isActive: boolean;
};

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<AuthUserResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    }),

  register: (
    name: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string
  ) =>
    apiFetch<AuthUserResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password, confirmPassword }),
      skipAuth: true,
    }),

  refresh: () =>
    apiFetch<{ ok: true }>('/auth/refresh', { method: 'POST', skipAuth: true }),

  logout: () =>
    apiFetch<{ ok: true }>('/auth/logout', { method: 'POST', skipAuth: true }),

  updateMe: (data: { name: string; email: string; phone: string }) =>
    apiFetch<User>('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
