import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAuth } from '@/lib/auth/request';
import { PAYMENT_REQUEST_SELECT, toPaymentRequestRecord } from '../util';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const requests = await prisma.paymentRequest.findMany({
      where: { userId: user.userId },
      select: PAYMENT_REQUEST_SELECT,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(requests.map(toPaymentRequestRecord));
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unauthorized';
    if (msg === 'Unauthorized') return NextResponse.json({ error: msg }, { status: 401 });
    return NextResponse.json({ error: 'Failed to load requests' }, { status: 500 });
  }
}
