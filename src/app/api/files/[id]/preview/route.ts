import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAuth } from '@/lib/auth/request';
import { createSignedUrl } from '@/lib/storage/files';
import { handleRouteError } from '@/lib/api/handle-route-error';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(req);
    const { id } = await params;
    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (!file.isPaidContent) {
      return NextResponse.json({ error: 'Preview not available for free content' }, { status: 400 });
    }
    if (!file.previewStoragePath) {
      return NextResponse.json({ error: 'Preview not available' }, { status: 404 });
    }

    const url = await createSignedUrl(file.previewStoragePath, 60);
    return NextResponse.json({ url });
  } catch (e) {
    return handleRouteError(e, 'Not found', 404);
  }
}
