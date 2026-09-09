'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { MoreHorizontal, Pencil, LucideCheck, X } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useLocale } from '@/lib/LocaleContext';
import { UI } from '@/lib/i18n';

const appointementsRows = [
    { id: 1, name: 'إبتهال اليثي', age: '28' , datetime: "10:30pm 7/20/2026", status: "pending", deposit:0 },
    { id: 2, name: 'Nawal El Zoghbe', age: '42' , datetime: "10:00pm 7/20/2026", status: "accepted", deposit:2000},
];

function AppointementActionsMenu({ appointement, locale }: { appointement: (typeof appointementsRows)[number]; locale: 'ar' | 'en' }) {
    const t = UI[locale];
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:border-[#3A8DDE]/30 hover:text-[#3A8DDE]"
                aria-label={t.appointmentActions}
            >
                <MoreHorizontal size={16} />
            </button>

            {open ? (
                <div className="absolute right-0 z-20 mt-2 w-40 rounded-2xl border border-gray-200 bg-white p-2 shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
                    <button type="button" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-[#FDE8EF] hover:text-[#E91E63]">
                        <Pencil size={14} />
                        {t.edit}
                    </button>
                    <button type="button" className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-[#FDE8EF] hover:text-[#E91E63]">
                        {appointement.status==="pending" ? <LucideCheck size={14} /> : <X size={14} />}
                        {appointement.status==="panding" ? t.accept : t.reject}
                    </button>
                    <button type="button" className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
                        <X size={14} />
                        {t.reject}
                    </button>
                </div>
            ) : null}
        </div>
    );
}

export default function ArticlesPage() {
    const { user, isAuthenticated } = useAuth();
    const { locale } = useLocale();
    const t = UI[locale];
    const isRTL = locale === 'ar';
    const isAdmin = isAuthenticated && user?.role === 'ADMIN';

    const comingSoonTitle = t.comingSoon;
    const comingSoonCopy = t.comingSoonCopy;

    const rows = useMemo(() => appointementsRows.map((appointement) => ({ ...appointement, label: appointement.name })), [locale]);

    if (!isAdmin) {
        return (
            <main className="min-h-screen bg-[#FFF8FB] px-4 py-35 text-[#2d1a1a] sm:px-6 lg:px-8" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="mx-auto flex max-w-4xl flex-col items-center justify-center rounded-[32px] border border-gray-200 bg-white px-8 py-20 text-center shadow-sm">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#E91E63]/10 text-3xl font-bold text-[#E91E63]">
                        🗓️
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3A8DDE]">{t.appointments}</p>
                    <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{comingSoonTitle}</h1>
                    <p className="mt-4 max-w-xl text-lg text-gray-600">{comingSoonCopy}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#FFF8FB] px-4 py-35 text-[#2d1a1a] sm:px-6 lg:px-8" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="mx-auto flex max-w-6xl flex-col gap-6">
                <section className="flex flex-col gap-4 rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3A8DDE]">{t.appointments}</p>
                        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{t.appointmentsManagement}</h1>
                    </div>
                </section>

                <section className="overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className= {isRTL ? "bg-[#FFF7FA] text-right text-gray-600" : "bg-[#FFF7FA] text-left text-gray-600"}>
                                <tr>
                                    <th className="px-4 py-3 font-semibold">{t.name}</th>
                                    <th className="px-4 py-3 font-semibold">{t.age}</th>
                                    <th className="px-4 py-3 font-semibold">{t.appointment}</th>
                                    <th className="px-4 py-3 font-semibold">{t.status}</th>
                                    <th className="px-4 py-3 font-semibold">{t.deposit}</th>
                                    <th className="px-4 py-3 font-semibold">{t.actions}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {rows.map((appointement) => (
                                    <tr key={appointement.id} className="hover:bg-[#FFF8FB]">
                                        <td className="px-4 py-4">
                                                {appointement.name}
                                        </td>
                                        <td className="px-4 py-4 text-gray-700">
                                            <div className="flex items-center gap-2">
                                                {appointement.age}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-gray-700">
                                            <div className="flex items-center gap-2">
                                                {appointement.datetime}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-gray-700">
                                            <div className="flex items-center gap-2">
                                                {appointement.status.toLocaleString().toUpperCase()}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-gray-700">
                                            <div className="flex items-center gap-2">
                                                {appointement.deposit}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <AppointementActionsMenu appointement={appointement} locale={locale} />
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
