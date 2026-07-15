import { PaymentMethod } from '@prisma/client';

const PAYMENT_METHODS = new Set<string>(Object.values(PaymentMethod));

/**
 * Validates that `value` is a known PaymentMethod.
 * Accepts `unknown` so it can be used directly on raw form-data / JSON fields.
 * Returns null for any invalid or non-string value.
 */
export function parsePaymentMethod(value: unknown): PaymentMethod | null {
  if (typeof value !== 'string' || !PAYMENT_METHODS.has(value)) return null;
  return value as PaymentMethod;
}

/**
 * Validates a URL path segment (e.g. from Next.js route params) as a PaymentMethod.
 * Decodes URI encoding before checking membership.
 * Returns null if the decoded value is not a known PaymentMethod.
 */
export function parsePaymentMethodParam(value: string): PaymentMethod | null {
  return parsePaymentMethod(decodeURIComponent(value));
}
