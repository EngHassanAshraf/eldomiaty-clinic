import { PaymentMethod } from '@prisma/client';
import { parsePaymentMethodParam } from '@/lib/payment/parse';

export { parsePaymentMethodParam };

export const PAYMENT_METHOD_SELECT = {
  method: true,
  displayName: true,
  accountName: true,
  accountNumber: true,
  instructions: true,
  isActive: true,
} as const;

export function toPaymentMethodSettingRecord(row: {
  method: PaymentMethod;
  displayName: string;
  accountName: string | null;
  accountNumber: string | null;
  instructions: string | null;
  isActive: boolean;
}) {
  return {
    method: row.method,
    displayName: row.displayName,
    accountName: row.accountName ?? undefined,
    accountNumber: row.accountNumber ?? undefined,
    instructions: row.instructions ?? undefined,
    isActive: row.isActive,
  };
}

