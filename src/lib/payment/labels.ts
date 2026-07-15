import type { PaymentMethod, PaymentStatus } from '@/lib/api/types';

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  BANK_TRANSFER: 'تحويل بنكي',
  INSTAPAY: 'إنستاباي',
  VODAFONE_CASH: 'فودافون كاش',
  ORANGE_CASH: 'أورانج كاش',
  ETISALAT_CASH: 'اتصالات كاش',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: 'قيد المراجعة',
  APPROVED: 'مقبول',
  REJECTED: 'مرفوض',
};

export function paymentStatusClass(status: PaymentStatus): string {
  if (status === 'APPROVED') {
    return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
  }
  if (status === 'REJECTED') {
    return 'bg-red-50 text-red-700 border border-red-200/60';
  }
  return 'bg-amber-50 text-amber-700 border border-amber-200/60';
}
