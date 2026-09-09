import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAuth } from '@/lib/auth/request';
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
} as const;

export async function GET(req: NextRequest) {
  try {
    const token = await requireAuth(req);
    const user = await prisma.user.findUnique({
      where: { id: token.userId },
      select: userSelect,
    });
    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = await requireAuth(req);
    const body = await req.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    if (phone.length < 8 || phone.length > 20) {
      return NextResponse.json({ error: 'invalid-phone' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { id: token.userId } });
    if (!existing || !existing.isActive) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (email !== existing.email) {
      const emailTaken = await prisma.user.findUnique({ where: { email } });
      if (emailTaken) {
        return NextResponse.json({ error: 'exist' }, { status: 400 });
      }
    }

    if (phone !== existing.phone) {
      const phoneTaken = await prisma.user.findFirst({
        where: { phone, NOT: { id: existing.id } },
      });
      if (phoneTaken) {
        return NextResponse.json({ error: 'phone-exist' }, { status: 400 });
      }
    }

    const updated = await prisma.user.update({
      where: { id: existing.id },
      data: {
        name,
        email,
        phone,
        emailVerified: email === existing.email ? existing.emailVerified : false,
        phoneVerified: phone === existing.phone ? existing.phoneVerified : false,
      },
      select: userSelect,
    });

    return NextResponse.json(updated);
  } catch (e) {
    return handleRouteError(e, 'Update failed', 400);
  }
}
