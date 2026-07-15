import { PaymentStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAdmin, requireAuth } from '@/lib/auth/request';
import { deletePaymentScreenshot, uploadPaymentScreenshot } from '@/lib/storage/payment-proofs';
import { PAYMENT_REQUEST_SELECT, parsePaymentMethod, toPaymentRequestRecord } from './util';
import { handleRouteError } from '@/lib/api/handle-route-error';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const requests = await prisma.paymentRequest.findMany({
      select: {
        ...PAYMENT_REQUEST_SELECT,
        user: { select: { email: true } },
      },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json(requests.map(toPaymentRequestRecord));
  } catch (e) {
    return handleRouteError(e, 'Failed to load requests');
  }
}

export async function POST(req: NextRequest) {
  let requestId: string | null = null;
  let screenshotPath: string | null = null;

  try {
    const user = await requireAuth(req);

    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { isPaid: true },
    });
    if (!dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (dbUser.isPaid) {
      return NextResponse.json({ error: 'Your subscription is already active' }, { status: 400 });
    }

    const formData = await req.formData();
    const method = parsePaymentMethod(formData.get('method'));
    const screenshot = formData.get('screenshot');

    if (!method) {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });
    }
    if (!(screenshot instanceof File)) {
      return NextResponse.json({ error: 'Screenshot is required' }, { status: 400 });
    }

    const activeMethod = await prisma.paymentMethodSetting.findFirst({
      where: { method, isActive: true },
    });
    if (!activeMethod) {
      return NextResponse.json({ error: 'Payment method is not available' }, { status: 400 });
    }

    const pending = await prisma.paymentRequest.findFirst({
      where: { userId: user.userId, status: PaymentStatus.PENDING },
    });
    if (pending) {
      return NextResponse.json({ error: 'You already have a pending payment request' }, { status: 409 });
    }

    const record = await prisma.paymentRequest.create({
      data: {
        userId: user.userId,
        method,
        screenshotUrl: 'pending',
        status: PaymentStatus.PENDING,
      },
    });
    requestId = record.id;

    const buffer = Buffer.from(await screenshot.arrayBuffer());
    screenshotPath = await uploadPaymentScreenshot(
      user.userId,
      record.id,
      buffer,
      screenshot.name,
      screenshot.type
    );

    const updated = await prisma.paymentRequest.update({
      where: { id: record.id },
      data: { screenshotUrl: screenshotPath },
      select: PAYMENT_REQUEST_SELECT,
    });

    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        action: 'PAYMENT_REQUEST_CREATED',
        entityType: 'PaymentRequest',
        entityId: record.id,
        metadata: { method },
      },
    });

    return NextResponse.json(
      { id: updated.id, status: updated.status },
      { status: 201 }
    );
  } catch (e) {
    if (requestId) {
      await prisma.paymentRequest.delete({ where: { id: requestId } }).catch(() => {});
    }
    if (screenshotPath) {
      await deletePaymentScreenshot(screenshotPath).catch(() => {});
    }

    const msg = e instanceof Error ? e.message : 'Submit failed';
    return handleRouteError(e, msg, 400);
  }
}
