import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AccountDropdown } from '../ui/AccountDropdown';
import { getAccountMenuItems } from '../navbar-menu';

describe('AccountDropdown', () => {
  it('renders USER items when expanded', () => {
    const html = renderToStaticMarkup(
      createElement(AccountDropdown, {
        displayName: 'Alice',
        items: getAccountMenuItems('USER', 'en'),
        locale: 'en',
        initialOpen: true,
      })
    );

    expect(html).toContain('Profile');
    expect(html).toContain('Appointments');
    expect(html).toContain('Subscription Orders');
    expect(html).toContain('Logout');
    expect(html).not.toContain('MROCG Files');
  });

  it('renders ADMIN items with role label when expanded', () => {
    const html = renderToStaticMarkup(
      createElement(AccountDropdown, {
        displayName: 'Admin',
        role: 'Administrator',
        items: getAccountMenuItems('ADMIN', 'en'),
        locale: 'en',
        initialOpen: true,
      })
    );

    expect(html).toContain('Administrator');
    expect(html).toContain('Dashboard');
    expect(html).toContain('Settings');
    expect(html).toContain('Logout');
  });

  it('renders Arabic labels when locale is ar', () => {
    const html = renderToStaticMarkup(
      createElement(AccountDropdown, {
        displayName: 'أليس',
        items: getAccountMenuItems('USER', 'ar'),
        locale: 'ar',
        initialOpen: true,
      })
    );

    expect(html).toContain('الملف الشخصي');
    expect(html).toContain('المواعيد');
    expect(html).toContain('طلبات الاشتراك');
    expect(html).toContain('تسجيل الخروج');
  });
});
