import { apiFetch } from './client';
import { FileRecord, SignedUrlResponse } from './types';

export const filesApi = {
  getFiles: () => apiFetch<FileRecord[]>('/files'),

  getFile: (id: string) => apiFetch<FileRecord>(`/files/${id}`),

  getPreview: (id: string) =>
    apiFetch<SignedUrlResponse>(`/files/${id}/preview`),

  getFullAccess: (id: string) =>
    apiFetch<SignedUrlResponse>(`/files/${id}/full-access`),

  upload: (formData: FormData) =>
    apiFetch<FileRecord>('/files', {
      method: 'POST',
      body: formData,
    }),

  update: (
    id: string,
    data: Partial<{ title: string; description: string; isPaidContent: boolean }>
  ) =>
    apiFetch<FileRecord>(`/files/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/files/${id}`, { method: 'DELETE' }),
};
