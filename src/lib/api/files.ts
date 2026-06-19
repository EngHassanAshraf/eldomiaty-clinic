import { ApiError, FileRecord, SignedUrlResponse } from './types';

async function filesRequest<T>(
  path: string,
  options: RequestInit = {},
  retried = false
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  const res = await fetch(`/api/files${path}`, {
    credentials: 'include',
    ...options,
    headers,
  });

  if (res.status === 401 && !retried) {
    const refresh = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });
    if (refresh.ok) return filesRequest<T>(path, options, true);
  }

  if (res.status === 204) {
    return undefined as unknown as T;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(data.error || data.message || res.statusText, res.status);
  }

  return data as T;
}

export const filesApi = {
  getFiles: (_token?: string | null) => filesRequest<FileRecord[]>(''),

  getFile: (id: string, _token?: string | null) => filesRequest<FileRecord>(`/${id}`),

  getPreview: (id: string, _token?: string | null) =>
    filesRequest<SignedUrlResponse>(`/${id}/preview`),

  getFullAccess: (id: string, _token?: string | null) =>
    filesRequest<SignedUrlResponse>(`/${id}/full-access`),

  upload: (formData: FormData, _token?: string | null) =>
    filesRequest<FileRecord>('', {
      method: 'POST',
      body: formData,
    }),

  update: (
    id: string,
    data: Partial<{ title: string; description: string; isPaidContent: boolean }>,
    _token?: string | null
  ) =>
    filesRequest<FileRecord>(`/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string, _token?: string | null) =>
    filesRequest<void>(`/${id}`, { method: 'DELETE' }),
};
