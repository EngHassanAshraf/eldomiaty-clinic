import { apiFetch } from './client';
import { CheckoutResponse, PaymentRecord } from './types';

export const paymentsApi = {
  createCheckout: (token: string) =>
    apiFetch<CheckoutResponse>('/payments/checkout', {
      method: 'POST',
      token,
    }),

  getPayments: (token: string) =>
    apiFetch<PaymentRecord[]>('/payments', { token }),
};
