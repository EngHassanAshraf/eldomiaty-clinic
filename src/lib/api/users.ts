import { apiFetch } from './client';
import { PaginatedUsers, User } from './types';

export const usersApi = {
  getUsers: (page = 1, limit = 20) =>
    apiFetch<PaginatedUsers>(`/users?page=${page}&limit=${limit}`),

  getUser: (id: string) => apiFetch<User>(`/users/${id}`),

  updateUser: (id: string, data: { isPaid?: boolean; isActive?: boolean }) =>
    apiFetch<User>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  /** @deprecated use updateUser */
  updateIsPaid: (id: string, isPaid: boolean) =>
    apiFetch<User>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isPaid }),
    }),
};
