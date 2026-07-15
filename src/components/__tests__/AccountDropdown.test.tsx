import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AccountDropdown } from '../ui/AccountDropdown';
import { getAccountMenuItems } from '../navbar-menu';

describe('AccountDropdown', () => {
  it('renders role-based items when expanded', () => {
    const html = renderToStaticMarkup(
      createElement(AccountDropdown, {
        displayName: 'Alice',
        items: getAccountMenuItems('USER', 'en'),
        initialOpen: true,
      })
    );

    expect(html).toContain('Profile');
    expect(html).toContain('Subscription Orders');
    expect(html).toContain('MROCG Files');
    expect(html).toContain('Logout');
  });
});
