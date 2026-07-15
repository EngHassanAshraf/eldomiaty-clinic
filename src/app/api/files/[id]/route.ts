import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAdmin, requireAuth } from '@/lib/auth/request';
import { deletePdf } from '@/lib/storage/files';
import { FILE_SELECT, toFileRecord } from '../util';
import { handleRouteError } from '@/lib/api/handle-route-error';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(req);
    const { id } = await params;
    const file = await prisma.file.findUnique({
      where: { id },
      select: FILE_SELECT,
    });
    if (!file) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(toFileRecord(file));
  } catch (e) {
    return handleRouteError(e, 'Not found', 404);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.file.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const data: { title?: string; description?: string; isPaidContent?: boolean } = {};
    if (typeof body.title === 'string') data.title = body.title;
    if (typeof body.description === 'string') data.description = body.description;
    if (typeof body.isPaidContent === 'boolean') data.isPaidContent = body.isPaidContent;

    if (data.isPaidContent === true && !existing.previewStoragePath) {
      return NextResponse.json(
        { error: 'Preview PDF is required for paid content' },
        { status: 400 }
      );
    }

    const updated = await prisma.file.update({
      where: { id },
      data,
      select: FILE_SELECT,
    });
    return NextResponse.json(toFileRecord(updated));
  } catch (e) {
    return handleRouteError(e, 'Update failed', 400);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
    const { id } = await params;
    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const paths = [file.storagePath];
    if (file.previewStoragePath) paths.push(file.previewStoragePath);
    await Promise.all(paths.map((path) => deletePdf(path)));
    await prisma.file.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    return handleRouteError(e, 'Not found', 404);
  }
}
