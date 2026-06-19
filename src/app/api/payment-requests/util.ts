import { PaymentMethod, PaymentStatus } from '@prisma/client';

export const PAYMENT_REQUEST_SELECT = {
  id: true,
  userId: true,
  method: true,
  status: true,
  adminNotes: true,
  reviewedAt: true,
  createdAt: true,
} as const;

export function toPaymentRequestRecord(
  row: {
    id: string;
    userId: string;
    method: PaymentMethod;
    status: PaymentStatus;
    adminNotes: string | null;
    reviewedAt: Date | null;
    createdAt: Date;
    user?: { email: string };
  }
) {
  return {
    id: row.id,
    userId: row.userId,
    userEmail: row.user?.email,
    method: row.method,
    status: row.status,
    adminNotes: row.adminNotes ?? undefined,
    reviewedAt: row.reviewedAt?.toISOString(),
    createdAt: row.createdAt.toISOString(),
  };
}

const PAYMENT_METHODS = new Set<string>(Object.values(PaymentMethod));

export function parsePaymentMethod(value: unknown): PaymentMethod | null {
  if (typeof value !== 'string' || !PAYMENT_METHODS.has(value)) return null;
  return value as PaymentMethod;
}
