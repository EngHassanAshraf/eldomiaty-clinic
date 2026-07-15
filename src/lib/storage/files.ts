import { getStorageClient } from './client';

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'clinic-files';
const MAX_BYTES = 50 * 1024 * 1024;

function storagePath(fileId: string, originalName: string): string {
  const base = originalName.replace(/\.pdf$/i, '').replace(/[^a-zA-Z0-9._-]/g, '_');
  return `medical/${fileId}/${base.slice(0, 100)}.pdf`;
}

export async function uploadPreviewPdf(
  fileId: string,
  data: Buffer,
  originalName: string
): Promise<string> {
  if (data.length > MAX_BYTES) throw new Error('File exceeds 50MB limit');
  if (!originalName.toLowerCase().endsWith('.pdf')) throw new Error('Only PDF files are allowed');

  const path = `medical/${fileId}/preview.pdf`;
  const { error } = await getStorageClient().storage.from(BUCKET).upload(path, data, {
    contentType: 'application/pdf',
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return path;
}

export async function uploadPdf(
  fileId: string,
  data: Buffer,
  originalName: string
): Promise<string> {
  if (data.length > MAX_BYTES) throw new Error('File exceeds 50MB limit');
  if (!originalName.toLowerCase().endsWith('.pdf')) throw new Error('Only PDF files are allowed');

  const path = storagePath(fileId, originalName);
  const { error } = await getStorageClient().storage.from(BUCKET).upload(path, data, {
    contentType: 'application/pdf',
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return path;
}

export async function deletePdf(storagePath: string): Promise<void> {
  const { error } = await getStorageClient().storage.from(BUCKET).remove([storagePath]);
  if (error) throw new Error(error.message);
}

export async function createSignedUrl(storagePath: string, expiresIn = 60): Promise<string> {
  const { data, error } = await getStorageClient()
    .storage.from(BUCKET)
    .createSignedUrl(storagePath, expiresIn);
  if (error || !data?.signedUrl) {
    throw new Error(error?.message || 'Failed to create signed URL');
  }
  return data.signedUrl;
}
