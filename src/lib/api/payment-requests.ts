import { apiFetch } from './client';
import { PaymentRequestRecord, SubmitPaymentRequestResponse } from './types';

export const paymentRequestsApi = {
  submit: (formData: FormData) =>
    apiFetch<SubmitPaymentRequestResponse>('/payment-requests', {
      method: 'POST',
      body: formData,
    }),

  listForAdmin: () =>
    apiFetch<PaymentRequestRecord[]>('/payment-requests'),

  listMine: () =>
    apiFetch<PaymentRequestRecord[]>('/payment-requests/mine'),

  approve: (id: string, adminNotes?: string) =>
    apiFetch<PaymentRequestRecord>(`/payment-requests/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify(adminNotes ? { adminNotes } : {}),
    }),

  reject: (id: string, adminNotes?: string) =>
    apiFetch<PaymentRequestRecord>(`/payment-requests/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify(adminNotes ? { adminNotes } : {}),
    }),

  getScreenshotUrl: (id: string) =>
    apiFetch<{ url: string }>(`/payment-requests/${id}/screenshot`),
};
