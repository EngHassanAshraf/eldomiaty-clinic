import { ApiError } from './types';

let _accessToken: string | null = null;
let _clearAuth: (() => void) | null = null;

export function setClientToken(token: string | null) {
  _accessToken = token;
}

export function setClientClearAuth(fn: () => void) {
  _clearAuth = fn;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string | null; skipAuth?: boolean } = {}
): Promise<T> {
  // Use Next.js proxy in browser to avoid CORS; use direct URL on server
  const baseUrl =
    typeof window !== 'undefined'
      ? '/api/backend'
      : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');

  const token = options.token !== undefined ? options.token : _accessToken;
  const { token: _t, skipAuth, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    ...(fetchOptions.headers as Record<string, string>),
  };

  // Only attach Authorization if token is non-null and non-empty
  if (!skipAuth && token && token.length > 0) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (!(fetchOptions.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...fetchOptions,
    headers,
  });

  // Handle 401 — attempt refresh then retry once
  if (response.status === 401 && !skipAuth) {
    try {
      const refreshRes = await fetch('/api/auth/refresh');
      if (refreshRes.ok) {
        const { accessToken } = await refreshRes.json();
        setClientToken(accessToken);

        // Retry original request with new token
        const retryHeaders = { ...headers, Authorization: `Bearer ${accessToken}` };
        const retryResponse = await fetch(`${baseUrl}${path}`, {
          ...fetchOptions,
          headers: retryHeaders,
        });

        if (retryResponse.status === 401) {
          _clearAuth?.();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw new ApiError('Session expired', 401);
        }

        if (!retryResponse.ok) {
          const errData = await retryResponse.json().catch(() => ({}));
          throw new ApiError(errData.message || retryResponse.statusText, retryResponse.status);
        }

        return retryResponse.json() as Promise<T>;
      }
    } catch (e) {
      if (e instanceof ApiError) throw e;
    }

    _clearAuth?.();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new ApiError('Session expired', 401);
  }

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new ApiError(
      errData.message || response.statusText,
      response.status
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json() as Promise<T>;
}
