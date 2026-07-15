import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAdmin } from '@/lib/auth/request';
import {
  PAYMENT_METHOD_SELECT,
  parsePaymentMethodParam,
  toPaymentMethodSettingRecord,
} from '../util';
import { handleRouteError } from '@/lib/api/handle-route-error';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ method: string }> }
) {
  try {
    await requireAdmin(req);
    const { method: methodParam } = await params;
    const method = parsePaymentMethodParam(methodParam);
    if (!method) {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });
    }

    const body = await req.json();
    const data: {
      displayName?: string;
      accountName?: string | null;
      accountNumber?: string | null;
      instructions?: string | null;
      isActive?: boolean;
    } = {};

    if (body.displayName !== undefined) {
      if (typeof body.displayName !== 'string' || !body.displayName.trim()) {
        return NextResponse.json({ error: 'Invalid display name' }, { status: 400 });
      }
      data.displayName = body.displayName.trim();
    }
    if (body.accountName !== undefined) {
      if (body.accountName !== null && typeof body.accountName !== 'string') {
        return NextResponse.json({ error: 'Invalid account name' }, { status: 400 });
      }
      data.accountName = body.accountName === null ? null : body.accountName.trim() || null;
    }
    if (body.accountNumber !== undefined) {
      if (body.accountNumber !== null && typeof body.accountNumber !== 'string') {
        return NextResponse.json({ error: 'Invalid account number' }, { status: 400 });
      }
      data.accountNumber = body.accountNumber === null ? null : body.accountNumber.trim() || null;
    }
    if (body.instructions !== undefined) {
      if (body.instructions !== null && typeof body.instructions !== 'string') {
        return NextResponse.json({ error: 'Invalid instructions' }, { status: 400 });
      }
      data.instructions = body.instructions === null ? null : body.instructions.trim() || null;
    }
    if (body.isActive !== undefined) {
      if (typeof body.isActive !== 'boolean') {
        return NextResponse.json({ error: 'Invalid isActive value' }, { status: 400 });
      }
      data.isActive = body.isActive;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const existing = await prisma.paymentMethodSetting.findUnique({ where: { method } });
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const updated = await prisma.paymentMethodSetting.update({
      where: { method },
      data,
      select: PAYMENT_METHOD_SELECT,
    });

    return NextResponse.json(toPaymentMethodSettingRecord(updated));
  } catch (e) {
    return handleRouteError(e, 'Update failed', 400);
  }
}
