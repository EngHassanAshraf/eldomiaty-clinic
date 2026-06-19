import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAuth } from '@/lib/auth/request';
import { PAYMENT_METHOD_SELECT, toPaymentMethodSettingRecord } from './util';

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
    const msg = e instanceof Error ? e.message : 'Unauthorized';
    if (msg === 'Unauthorized') return NextResponse.json({ error: msg }, { status: 401 });
    return NextResponse.json({ error: 'Failed to load payment methods' }, { status: 500 });
  }
}
