import { PaymentStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAdmin } from '@/lib/auth/request';
import { PAYMENT_REQUEST_SELECT, toPaymentRequestRecord } from '../../util';
import { handleRouteError } from '@/lib/api/handle-route-error';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(req);
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const adminNotes = typeof body.adminNotes === 'string' ? body.adminNotes : undefined;

    const existing = await prisma.paymentRequest.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (existing.status !== PaymentStatus.PENDING) {
      return NextResponse.json({ error: 'Request is not pending' }, { status: 400 });
    }

    const updated = await prisma.paymentRequest.update({
      where: { id },
      data: {
        status: PaymentStatus.REJECTED,
        reviewedAt: new Date(),
        reviewedByAdminId: admin.userId,
        adminNotes: adminNotes ?? null,
      },
      select: {
        ...PAYMENT_REQUEST_SELECT,
        user: { select: { email: true } },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.userId,
        action: 'PAYMENT_REJECTED',
        entityType: 'PaymentRequest',
        entityId: id,
        metadata: { requestId: id, userId: existing.userId },
      },
    });

    return NextResponse.json(toPaymentRequestRecord(updated));
  } catch (e) {
    return handleRouteError(e, 'Not found', 404);
  }
}
