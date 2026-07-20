'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { MoreHorizontal, Plus, Eye, Pencil, EyeOff, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useLocale } from '@/lib/LocaleContext';

const articleRows = [
    { id: 1, title: { ar: 'أحدث علاجات التلقيح الصناعي', en: 'Latest IVF Treatments' }, views: 1240, isHidden: false },
    { id: 2, title: { ar: 'متى تحتاجين زيارة أخصائي أمراض نساء', en: 'When to See a Gynecologist' }, views: 842, isHidden: true },
];

function ArticleActionsMenu({ article, locale }: { article: (typeof articleRows)[number]; locale: 'ar' | 'en' }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:border-[#3A8DDE]/30 hover:text-[#3A8DDE]"
                aria-label={locale === 'ar' ? 'إجراءات المقالة' : 'Article actions'}
            >
                <MoreHorizontal size={16} />
            </button>

            {open ? (
                <div className="absolute right-0 z-20 mt-2 w-44 rounded-2xl border border-gray-200 bg-white p-2 shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
                    <button type="button" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-[#FDE8EF] hover:text-[#E91E63]">
                        <Pencil size={14} />
                        {locale === 'ar' ? 'تحرير' : 'Edit'}
                    </button>
                    <button type="button" className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-[#FDE8EF] hover:text-[#E91E63]">
                        {article.isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                        {article.isHidden ? (locale === 'ar' ? 'إظهار' : 'Show') : (locale === 'ar' ? 'إخفاء' : 'Hide')}
                    </button>
                    <button type="button" className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
                        <Trash2 size={14} />
                        {locale === 'ar' ? 'حذف' : 'Delete'}
                    </button>
                </div>
            ) : null}
        </div>
    );
}

export default function ArticlesPage() {
    const { user, isAuthenticated } = useAuth();
    const { locale } = useLocale();
    const isRTL = locale === 'ar';
    const isAdmin = isAuthenticated && user?.role === 'ADMIN';

    const pageTitle = locale === 'ar' ? 'المقالات الطبية' : 'Medical Articles';
    const comingSoonTitle = locale === 'ar' ? 'قريباً' : 'Coming Soon';
    const comingSoonCopy = locale === 'ar'
        ? 'ستظهر مقالات طبية مفيدة هنا قريبًا.'
        : 'Helpful medical articles will be available here soon.';

    const rows = useMemo(() => articleRows.map((article) => ({ ...article, label: article.title[locale] })), [locale]);

    if (!isAdmin) {
        return (
            <main className="min-h-screen bg-[#FFF8FB] px-4 py-35 text-[#2d1a1a] sm:px-6 lg:px-8" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="mx-auto flex max-w-4xl flex-col items-center justify-center rounded-4xl border border-gray-200 bg-white px-8 py-20 text-center shadow-sm">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#E91E63]/10 text-3xl font-bold text-[#E91E63]">
                        ✚
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3A8DDE]">{pageTitle}</p>
                    <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{comingSoonTitle}</h1>
                    <p className="mt-4 max-w-xl text-lg text-gray-600">{comingSoonCopy}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#FFF8FB] px-4 py-35 text-[#2d1a1a] sm:px-6 lg:px-8" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="mx-auto flex max-w-6xl flex-col gap-6">
                <section className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3A8DDE]">{pageTitle}</p>
                        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{locale === 'ar' ? 'إدارة المقالات' : 'Articles Management'}</h1>
                    </div>
                    <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E91E63] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#d0175b]">
                        <Plus size={16} />
                        {locale === 'ar' ? 'مقالة جديدة' : 'New Article'}
                    </button>
                </section>

                <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-[#FFF7FA] text-left text-gray-600">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">{locale === 'ar' ? 'العنوان' : 'Title'}</th>
                                    <th className="px-4 py-3 font-semibold">{locale === 'ar' ? 'إجمالي المشاهدات' : 'Total Views'}</th>
                                    <th className="px-4 py-3 font-semibold">{locale === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {rows.map((article) => (
                                    <tr key={article.id} className="hover:bg-[#FFF8FB]">
                                        <td className="px-4 py-4">
                                            <Link href={`/articles/${article.id}`} className="font-semibold text-[#3A8DDE] transition-colors hover:text-[#2f74b8]">
                                                {article.label}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-4 text-gray-700">
                                            <div className="flex items-center gap-2">
                                                <Eye size={15} className="text-[#3A8DDE]" />
                                                {article.views.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <ArticleActionsMenu article={article} locale={locale} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </main>
    );
}
