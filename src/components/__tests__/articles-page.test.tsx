import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ArticlesPage from '../../app/articles/page';
import { useAuth } from '@/contexts/auth-context';
import { useLocale } from '@/lib/LocaleContext';

const mockedUseAuth = vi.mocked(useAuth);
const mockedUseLocale = vi.mocked(useLocale);

vi.mock('@/contexts/auth-context', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/lib/LocaleContext', () => ({
  useLocale: vi.fn(),
}));

describe('ArticlesPage', () => {
  beforeEach(() => {
    mockedUseLocale.mockReturnValue({ locale: 'en', setLocale: vi.fn() } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders a coming soon state for regular users', () => {
    mockedUseAuth.mockReturnValue({
      user: { role: 'USER' },
      isAuthenticated: true,
    } as any);

    const html = renderToStaticMarkup(createElement(ArticlesPage));

    expect(html).toContain('Coming Soon');
    expect(html).toContain('Medical Articles');
  });

  it('renders management controls for administrators', () => {
    mockedUseAuth.mockReturnValue({
      user: { role: 'ADMIN' },
      isAuthenticated: true,
    } as any);

    const html = renderToStaticMarkup(createElement(ArticlesPage));

    expect(html).toContain('New Article');
    expect(html).toContain('Title');
    expect(html).toContain('Total Views');
  });
});
