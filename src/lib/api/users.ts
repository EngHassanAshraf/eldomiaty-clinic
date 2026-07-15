import { apiFetch } from './client';
import { PaginatedUsers, User } from './types';

export const usersApi = {
  getUsers: (page = 1, limit = 20) =>
    apiFetch<PaginatedUsers>(`/users?page=${page}&limit=${limit}`),

  updateIsPaid: (id: string, isPaid: boolean) =>
    apiFetch<User>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isPaid }),
    }),
};
