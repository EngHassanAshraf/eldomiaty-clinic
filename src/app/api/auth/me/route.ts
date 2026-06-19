import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAuth } from '@/lib/auth/request';

export async function GET(req: NextRequest) {
  try {
    const token = await requireAuth(req);
    const user = await prisma.user.findUnique({
      where: { id: token.userId },
      select: { id: true, email: true, role: true, isPaid: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({
      id: user.id,
      email: user.email,
      role: user.role,
      isPaid: user.isPaid,
    });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
