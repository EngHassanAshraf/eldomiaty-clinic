import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAuth } from '@/lib/auth/request';
import { PAYMENT_METHOD_SELECT, toPaymentMethodSettingRecord } from './util';
import { handleRouteError } from '@/lib/api/handle-route-error';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const isAdmin = user.role === Role.ADMIN;

    const methods = await prisma.paymentMethodSetting.findMany({
      where: isAdmin ? {} : { isActive: true },
      select: PAYMENT_METHOD_SELECT,
      orderBy: { method: 'asc' },
    });

    return NextResponse.json(methods.map(toPaymentMethodSettingRecord));
  } catch (e) {
    return handleRouteError(e, 'Failed to load payment methods');
  }
}
