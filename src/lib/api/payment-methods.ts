import { apiFetch } from './client';
import { PaymentMethod, PaymentMethodSettingRecord, PaymentMethodSettingUpdate } from './types';

export const paymentMethodsApi = {
  listActive: () =>
    apiFetch<PaymentMethodSettingRecord[]>('/payment-methods'),

  update: (method: PaymentMethod, payload: PaymentMethodSettingUpdate) =>
    apiFetch<PaymentMethodSettingRecord>(`/payment-methods/${method}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
};
