import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

/**
 * Returns the shared Supabase client for storage operations.
 * Lazily initialised once; throws if env vars are missing.
 */
export function getStorageClient(): SupabaseClient {
  if (!_client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('Supabase storage is not configured');
    _client = createClient(url, key, { auth: { persistSession: false } });
  }
  return _client;
}
