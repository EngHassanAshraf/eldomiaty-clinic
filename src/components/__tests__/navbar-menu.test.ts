import { describe, expect, it } from 'vitest';
import { getAccountMenuItems, getProfileDisplayName } from '../navbar-menu';

describe('navbar menu helpers', () => {
  it('returns user menu items for regular users', () => {
    const items = getAccountMenuItems('USER', 'en');

    expect(items.map((item) => item.key)).toEqual(['profile', 'orders', 'files', 'logout']);
    expect(items[0].href).toBe('/profile');
    expect(items[1].href).toBe('/payment/my-requests');
  });

  it('returns admin menu items for administrators', () => {
    const items = getAccountMenuItems('ADMIN', 'ar');

    expect(items.map((item) => item.key)).toEqual(['dashboard', 'settings', 'logout']);
    expect(items[0].href).toBe('/dashboard');
    expect(items[1].href).toBe('/maintenance');
  });

  it('uses the email prefix as a fallback profile label', () => {
    expect(getProfileDisplayName({ email: 'patient@example.com' } as any)).toBe('patient');
    expect(getProfileDisplayName({ email: 'user.name@clinic.com' } as any)).toBe('user.name');
  });
});
