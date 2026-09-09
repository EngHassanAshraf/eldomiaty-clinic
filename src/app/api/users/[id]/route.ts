import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAdmin } from '@/lib/auth/request';
import { handleRouteError } from '@/lib/api/handle-route-error';

const userSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  emailVerified: true,
  phoneVerified: true,
  role: true,
  isPaid: true,
  isActive: true,
  createdAt: true,
} as const;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
    if (!user) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (e) {
    return handleRouteError(e, 'Failed to load user');
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(req);
    const { id } = await params;
    const body = await req.json();

    const hasIsPaid = typeof body.isPaid === 'boolean';
    const hasIsActive = typeof body.isActive === 'boolean';
    if (!hasIsPaid && !hasIsActive) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (hasIsActive && body.isActive === false && id === admin.userId) {
      return NextResponse.json({ error: 'cannot-deactivate-self' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(hasIsPaid ? { isPaid: body.isPaid as boolean } : {}),
        ...(hasIsActive ? { isActive: body.isActive as boolean } : {}),
      },
      select: userSelect,
    });

    if (hasIsActive && body.isActive === false) {
      await prisma.userSession.deleteMany({ where: { userId: id } });
    }

    return NextResponse.json(updated);
  } catch (e) {
    return handleRouteError(e, 'Update failed', 400);
  }
}
