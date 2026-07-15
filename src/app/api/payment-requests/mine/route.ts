import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAuth } from '@/lib/auth/request';
import { PAYMENT_REQUEST_SELECT, toPaymentRequestRecord } from '../util';
import { handleRouteError } from '@/lib/api/handle-route-error';

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
    return handleRouteError(e, 'Failed to load requests');
  }
}
