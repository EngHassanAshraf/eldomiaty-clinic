import { apiFetch } from './client';
import { User, PaginatedUsers } from './types';

export const usersApi = {
  getUsers: (token: string, page = 1, limit = 20) =>
    apiFetch<PaginatedUsers>(`/users?page=${page}&limit=${limit}`, { token }),

  getUser: (id: string, token: string) =>
    apiFetch<User>(`/users/${id}`, { token }),
};
