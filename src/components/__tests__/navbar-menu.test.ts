import { describe, expect, it } from 'vitest';
import { getAccountMenuItems, getProfileDisplayName } from '../navbar-menu';

describe('navbar menu helpers', () => {
  it('returns user menu items for regular users', () => {
    const items = getAccountMenuItems('USER', 'en');

    expect(items.map((item) => item.key)).toEqual(['profile', 'appointments', 'orders', 'logout']);
    expect(items[0].href).toBe('/profile');
    expect(items[1].href).toBe('/appointments');
    expect(items[2].href).toBe('/payment/my-requests');
    expect(items[3].action).toBe('logout');
  });

  it('returns admin menu items for administrators', () => {
    const items = getAccountMenuItems('ADMIN', 'ar');

    expect(items.map((item) => item.key)).toEqual(['dashboard', 'settings', 'logout']);
    expect(items[0].href).toBe('/dashboard');
    expect(items[1].href).toBe('/settings');
    expect(items[2].action).toBe('logout');
  });

  it('uses the email prefix as a fallback profile label', () => {
    expect(getProfileDisplayName({ email: 'patient@example.com' } as any)).toBe('patient');
    expect(getProfileDisplayName({ email: 'user.name@clinic.com' } as any)).toBe('user.name');
  });
});
