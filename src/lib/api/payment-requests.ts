import { apiFetch } from './client';
import { PaymentRequestRecord, SubmitPaymentRequestResponse } from './types';

export const paymentRequestsApi = {
  submit: (formData: FormData, token?: string | null) =>
    apiFetch<SubmitPaymentRequestResponse>('/payment-requests', {
      method: 'POST',
      body: formData,
      token,
    }),

  listForAdmin: (token?: string | null) =>
    apiFetch<PaymentRequestRecord[]>('/payment-requests', { token }),

  listMine: (token?: string | null) =>
    apiFetch<PaymentRequestRecord[]>('/payment-requests/mine', { token }),

  approve: (id: string, token?: string | null, adminNotes?: string) =>
    apiFetch<PaymentRequestRecord>(`/payment-requests/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify(adminNotes ? { adminNotes } : {}),
      token,
    }),

  reject: (id: string, token?: string | null, adminNotes?: string) =>
    apiFetch<PaymentRequestRecord>(`/payment-requests/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify(adminNotes ? { adminNotes } : {}),
      token,
    }),

  getScreenshotUrl: (id: string, token?: string | null) =>
    apiFetch<{ url: string }>(`/payment-requests/${id}/screenshot`, { token }),
};
