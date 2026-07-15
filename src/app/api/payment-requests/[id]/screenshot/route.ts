import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAdmin } from '@/lib/auth/request';
import { createPaymentProofSignedUrl } from '@/lib/storage/payment-proofs';
import { handleRouteError } from '@/lib/api/handle-route-error';

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
    return handleRouteError(e, 'Not found', 404);
  }
}
