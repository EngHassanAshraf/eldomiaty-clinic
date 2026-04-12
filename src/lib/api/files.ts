import { apiFetch } from './client';
import { FileRecord, SignedUrlResponse } from './types';

export const filesApi = {
  getFiles: (token?: string | null) =>
    apiFetch<FileRecord[]>('/files', { token, skipAuth: true }),

  getPreview: (id: string, token: string) =>
    apiFetch<SignedUrlResponse>(`/files/${id}/preview`, { token }),

  getFullAccess: (id: string, token: string) =>
    apiFetch<SignedUrlResponse>(`/files/${id}/full-access`, { token }),

  upload: (formData: FormData, token: string) =>
    apiFetch<FileRecord>('/files', {
      method: 'POST',
      body: formData,
      token,
    }),

  update: (id: string, data: Partial<{ title: string; description: string; isPaidContent: boolean }>, token: string) =>
    apiFetch<FileRecord>(`/files/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      token,
    }),

  delete: (id: string, token: string) =>
    apiFetch<void>(`/files/${id}`, {
      method: 'DELETE',
      token,
    }),
};
