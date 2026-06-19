import { apiFetch } from './client';
import { PaginatedUsers, User } from './types';

export const usersApi = {
  getUsers: (token: string, page = 1, limit = 20) =>
    apiFetch<PaginatedUsers>(`/users?page=${page}&limit=${limit}`, { token }),

  updateIsPaid: (id: string, isPaid: boolean, token: string) =>
    apiFetch<User>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isPaid }),
      token,
    }),
};
