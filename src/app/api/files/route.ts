import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAdmin, requireAuth } from '@/lib/auth/request';
import { deletePdf, uploadPdf, uploadPreviewPdf } from '@/lib/storage/files';
import { FILE_SELECT, toFileRecord } from './util';
import { handleRouteError } from '@/lib/api/handle-route-error';

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    const files = await prisma.file.findMany({
      select: FILE_SELECT,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(files.map(toFileRecord));
  } catch (e) {
    return handleRouteError(e, 'Failed to load files');
  }
}

export async function POST(req: NextRequest) {
  let recordId: string | null = null;
  let storagePath: string | null = null;
  let previewStoragePath: string | null = null;

  try {
    await requireAdmin(req);
    const formData = await req.formData();
    const file = formData.get('file');
    const previewFile = formData.get('previewFile');
    const title = formData.get('title');
    const description = formData.get('description');
    const isPaidContent = formData.get('isPaidContent') === 'true';

    if (!(file instanceof File) || !title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    if (isPaidContent && !(previewFile instanceof File)) {
      return NextResponse.json({ error: 'Preview PDF is required for paid content' }, { status: 400 });
    }

    const record = await prisma.file.create({
      data: {
        title,
        description: typeof description === 'string' ? description : null,
        isPaidContent,
        storagePath: `pending/${randomUUID()}`,
      },
    });
    recordId = record.id;

    const buffer = Buffer.from(await file.arrayBuffer());
    storagePath = await uploadPdf(record.id, buffer, file.name);

    if (isPaidContent && previewFile instanceof File) {
      const previewBuffer = Buffer.from(await previewFile.arrayBuffer());
      previewStoragePath = await uploadPreviewPdf(record.id, previewBuffer, previewFile.name);
    }

    const updated = await prisma.file.update({
      where: { id: record.id },
      data: { storagePath, previewStoragePath },
      select: FILE_SELECT,
    });
    return NextResponse.json(toFileRecord(updated), { status: 201 });
  } catch (e) {
    if (storagePath) await deletePdf(storagePath).catch(() => {});
    if (previewStoragePath) await deletePdf(previewStoragePath).catch(() => {});
    if (recordId) await prisma.file.delete({ where: { id: recordId } }).catch(() => {});

    const msg = e instanceof Error ? e.message : 'Upload failed';
    return handleRouteError(e, msg, 400);
  }
}
