import { getStorageClient } from './client';

const BUCKET =
  process.env.SUPABASE_PAYMENT_BUCKET ||
  process.env.SUPABASE_STORAGE_BUCKET ||
  'clinic-files';
const MAX_BYTES = 10 * 1024 * 1024;

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function extensionFor(mimeType: string, originalName: string): string {
  if (mimeType === 'image/png') return '.png';
  if (mimeType === 'image/webp') return '.webp';
  if (mimeType === 'image/jpeg') return '.jpg';
  const lower = originalName.toLowerCase();
  if (lower.endsWith('.png')) return '.png';
  if (lower.endsWith('.webp')) return '.webp';
  return '.jpg';
}

function paymentProofPath(
  userId: string,
  requestId: string,
  mimeType: string,
  originalName: string
): string {
  const ext = extensionFor(mimeType, originalName);
  return `payment-proofs/${userId}/${requestId}/proof${ext}`;
}

export async function uploadPaymentScreenshot(
  userId: string,
  requestId: string,
  data: Buffer,
  originalName: string,
  mimeType: string
): Promise<string> {
  if (data.length > MAX_BYTES) throw new Error('Screenshot exceeds 10MB limit');
  if (!ALLOWED_TYPES.has(mimeType)) {
    throw new Error('Screenshot must be JPEG, PNG, or WebP');
  }

  const path = paymentProofPath(userId, requestId, mimeType, originalName);
  const { error } = await getStorageClient().storage.from(BUCKET).upload(path, data, {
    contentType: mimeType,
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return path;
}

export async function deletePaymentScreenshot(storagePath: string): Promise<void> {
  const { error } = await getStorageClient().storage.from(BUCKET).remove([storagePath]);
  if (error) throw new Error(error.message);
}

export async function createPaymentProofSignedUrl(
  storagePath: string,
  expiresIn = 300
): Promise<string> {
  const { data, error } = await getStorageClient()
    .storage.from(BUCKET)
    .createSignedUrl(storagePath, expiresIn);
  if (error || !data?.signedUrl) {
    throw new Error(error?.message || 'Failed to create signed URL');
  }
  return data.signedUrl;
}
