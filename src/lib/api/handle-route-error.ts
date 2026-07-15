import { NextResponse } from 'next/server';

/**
 * Converts a caught route-handler error into the appropriate NextResponse.
 *
 * Convention used throughout the API routes:
 *   - requireAuth()  throws 'Unauthorized'  → 401
 *   - requireAdmin() throws 'Forbidden'     → 403
 *   - Everything else                       → fallbackStatus (default 500)
 *
 * @param e             The caught value (usually an Error).
 * @param fallbackMsg   Message returned when the error is not Unauthorized/Forbidden.
 * @param fallbackStatus HTTP status used for the fallback case (default 500).
 */
export function handleRouteError(
  e: unknown,
  fallbackMsg: string,
  fallbackStatus: number = 500
): NextResponse {
  const msg = e instanceof Error ? e.message : '';
  if (msg === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (msg === 'Forbidden')    return NextResponse.json({ error: 'Forbidden' },    { status: 403 });
  return NextResponse.json({ error: msg || fallbackMsg }, { status: fallbackStatus });
}
