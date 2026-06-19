import { PaymentStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAdmin } from '@/lib/auth/request';
import { PAYMENT_REQUEST_SELECT, toPaymentRequestRecord } from '../../util';

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

    const [updated] = await prisma.$transaction([
      prisma.paymentRequest.update({
        where: { id },
        data: {
          status: PaymentStatus.APPROVED,
          reviewedAt: new Date(),
          reviewedByAdminId: admin.userId,
          adminNotes: adminNotes ?? existing.adminNotes,
        },
        select: {
          ...PAYMENT_REQUEST_SELECT,
          user: { select: { email: true } },
        },
      }),
      prisma.user.update({
        where: { id: existing.userId },
        data: { isPaid: true },
      }),
    ]);

    await prisma.auditLog.createMany({
      data: [
        {
          userId: admin.userId,
          action: 'PAYMENT_APPROVED',
          entityType: 'PaymentRequest',
          entityId: id,
          metadata: { requestId: id, userId: existing.userId },
        },
        {
          userId: existing.userId,
          action: 'USER_IS_PAID_UPDATED',
          entityType: 'User',
          entityId: existing.userId,
          metadata: { source: 'payment_request', requestId: id },
        },
      ],
    });

    return NextResponse.json(toPaymentRequestRecord(updated));
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Approve failed';
    if (msg === 'Unauthorized') return NextResponse.json({ error: msg }, { status: 401 });
    if (msg === 'Forbidden') return NextResponse.json({ error: msg }, { status: 403 });
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
