import { ApiError } from './types';

const COOKIE_SESSION = 'cookie';

let _accessToken: string | null = null;
let _clearAuth: (() => void) | null = null;
let refreshPromise: Promise<boolean> | null = null;

export function setClientToken(token: string | null) {
  _accessToken = token;
}

export function setClientClearAuth(fn: () => void) {
  _clearAuth = fn;
}

function withAuth(headers: Record<string, string>, token: string | null) {
  if (token && token !== COOKIE_SESSION) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string | null; skipAuth?: boolean } = {}
): Promise<T> {
  const baseUrl = typeof window !== 'undefined' ? '/api' : process.env.NEXT_PUBLIC_APP_URL ?? '';

  const token = options.token !== undefined ? options.token : _accessToken;
  const { token: _t, skipAuth, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (!skipAuth) withAuth(headers, token);

  if (!(fetchOptions.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...fetchOptions,
    headers,
    credentials: 'include',
  });

  if (response.status === 401 && !skipAuth) {
    try {
      if (!refreshPromise) {
        refreshPromise = fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        })
          .then((res) => res.ok)
          .catch(() => false)
          .finally(() => {
            refreshPromise = null;
          });
      }

      const refreshOk = await refreshPromise;
      if (refreshOk) {
        setClientToken(COOKIE_SESSION);

        const retryHeaders = { ...headers };
        if (!skipAuth) withAuth(retryHeaders, COOKIE_SESSION);

        const retryResponse = await fetch(`${baseUrl}${path}`, {
          ...fetchOptions,
          headers: retryHeaders,
          credentials: 'include',
        });

        if (retryResponse.status === 401) {
          _clearAuth?.();
          if (typeof window !== 'undefined') window.dispatchEvent(new Event('auth:expired'));
          throw new ApiError('Session expired', 401);
        }

        if (!retryResponse.ok) {
          const errData = await retryResponse.json().catch(() => ({}));
          throw new ApiError(errData.error || errData.message || retryResponse.statusText, retryResponse.status);
        }

        return retryResponse.json() as Promise<T>;
      }
    } catch (e) {
      if (e instanceof ApiError) throw e;
    }

    _clearAuth?.();
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('auth:expired'));
    throw new ApiError('Session expired', 401);
  }

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new ApiError(errData.error || errData.message || response.statusText, response.status);
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json() as Promise<T>;
}
