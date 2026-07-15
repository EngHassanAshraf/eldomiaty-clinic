import { apiFetch } from './client';
import { FileRecord, SignedUrlResponse } from './types';

export const filesApi = {
  getFiles: (_token?: string | null) => apiFetch<FileRecord[]>('/files'),

  getFile: (id: string, _token?: string | null) => apiFetch<FileRecord>(`/files/${id}`),

  getPreview: (id: string, _token?: string | null) =>
    apiFetch<SignedUrlResponse>(`/files/${id}/preview`),

  getFullAccess: (id: string, _token?: string | null) =>
    apiFetch<SignedUrlResponse>(`/files/${id}/full-access`),

  upload: (formData: FormData, _token?: string | null) =>
    apiFetch<FileRecord>('/files', {
      method: 'POST',
      body: formData,
    }),

  update: (
    id: string,
    data: Partial<{ title: string; description: string; isPaidContent: boolean }>,
    _token?: string | null
  ) =>
    apiFetch<FileRecord>(`/files/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string, _token?: string | null) =>
    apiFetch<void>(`/files/${id}`, { method: 'DELETE' }),
};
