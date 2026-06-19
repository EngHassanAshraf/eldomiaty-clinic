import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAuth } from '@/lib/auth/request';
import { createSignedUrl } from '@/lib/storage/files';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await requireAuth(req);
    const { id } = await params;
    const [file, dbUser] = await Promise.all([
      prisma.file.findUnique({ where: { id } }),
      prisma.user.findUnique({
        where: { id: token.userId },
        select: { isPaid: true },
      }),
    ]);
    if (!file || !dbUser) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (file.isPaidContent && !dbUser.isPaid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const url = await createSignedUrl(file.storagePath, 3600);
    return NextResponse.json({ url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unauthorized';
    if (msg === 'Unauthorized') return NextResponse.json({ error: msg }, { status: 401 });
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
