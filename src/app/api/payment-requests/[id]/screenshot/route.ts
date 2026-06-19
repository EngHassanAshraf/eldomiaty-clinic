import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAdmin } from '@/lib/auth/request';
import { createPaymentProofSignedUrl } from '@/lib/storage/payment-proofs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
    const { id } = await params;
    const request = await prisma.paymentRequest.findUnique({ where: { id } });
    if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const url = await createPaymentProofSignedUrl(request.screenshotUrl, 300);
    return NextResponse.json({ url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unauthorized';
    if (msg === 'Unauthorized') return NextResponse.json({ error: msg }, { status: 401 });
    if (msg === 'Forbidden') return NextResponse.json({ error: msg }, { status: 403 });
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
