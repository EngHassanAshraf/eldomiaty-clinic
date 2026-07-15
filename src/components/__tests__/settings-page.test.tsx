import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import SettingsPage from '../../app/settings/page';
import { useAuth } from '@/contexts/auth-context';
import { useLocale } from '@/lib/LocaleContext';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/contexts/auth-context', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/lib/LocaleContext', () => ({
  useLocale: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);
const mockedUseLocale = vi.mocked(useLocale);

describe('SettingsPage', () => {
  beforeEach(() => {
    mockedUseLocale.mockReturnValue({ locale: 'en', setLocale: vi.fn() } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders general and clinic settings for administrators', () => {
    mockedUseAuth.mockReturnValue({
      user: { role: 'ADMIN' },
      isAuthenticated: true,
    } as any);

    const html = renderToStaticMarkup(createElement(SettingsPage));

    expect(html).toContain('Site Settings');
    expect(html).toContain('General');
    expect(html).toContain('Clinic');
    expect(html).toContain('Registration Enabled');
    expect(html).toContain('Clinic Name');
  });
});
