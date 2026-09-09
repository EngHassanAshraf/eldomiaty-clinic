'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { CalendarDays, CreditCard, FileText, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import VerificationBadge from '@/components/ui/VerificationBadge';
import PaymentBadge from '@/components/ui/PaymentBadge';
import SkeletonList from '@/components/ui/SkeletonList';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useAuth } from '@/contexts/auth-context';
import { getProfileDisplayName } from '@/lib/user';
import { authApi } from '@/lib/api/auth';
import { paymentRequestsApi } from '@/lib/api/payment-requests';
import { ApiError, PaymentRequestRecord } from '@/lib/api/types';
import { PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS, paymentStatusClass } from '@/lib/payment/labels';
import { useLocale } from '@/lib/LocaleContext';
import { UI } from '@/lib/i18n';

export default function ProfilePage() {
  const { isLoading, user } = useRequireAuth();
  const { refreshAuth } = useAuth();
  const { locale } = useLocale();
  const t = UI[locale];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [payments, setPayments] = useState<PaymentRequestRecord[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [hasPending, setHasPending] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name ?? '');
    setEmail(user.email ?? '');
    setPhone(user.phone ?? '');
  }, [user]);

  const loadPayments = useCallback(async () => {
    if (!user) return;
    setPaymentsLoading(true);
    try {
      const data = await paymentRequestsApi.listMine();
      setPayments(data.slice(0, 5));
      setHasPending(data.some((r) => r.status === 'PENDING'));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t.genericError);
    } finally {
      setPaymentsLoading(false);
    }
  }, [user, t.genericError]);

  useEffect(() => {
    void loadPayments();
  }, [loadPayments]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await authApi.updateMe({ name: name.trim(), email: email.trim(), phone: phone.trim() });
      await refreshAuth();
      toast.success(t.profileUpdated);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : t.profileUpdateFailed;
      if (msg === 'exist') toast.error(t.emailExists);
      else if (msg === 'phone-exist') toast.error(t.phoneExists);
      else if (msg === 'invalid-phone') toast.error(t.phoneInvalid);
      else toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !user) {
    return null;
  }

  const displayName = getProfileDisplayName(user);
  const canRequestPayment = !user.isPaid && !hasPending;

  return (
    <main className="min-h-screen bg-[#FFF8FB] px-4 py-40 text-[#2d1a1a] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <section className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E91E63]/15 text-xl font-bold text-[#E91E63]">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1.5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3A8DDE]">{t.profile}</p>
                <h1 className="text-2xl font-bold">{displayName}</h1>
                <div className="flex flex-wrap items-center gap-2">
                  <PaymentBadge isPaid={user.isPaid} />
                  <span className="rounded-full border border-[#E91E63]/20 bg-[#FFF2F7] px-3 py-1 text-xs font-semibold text-[#E91E63]">
                    {user.role === 'ADMIN' ? t.admin : t.user}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold mb-4">{t.editPersonalInfo}</h2>
          <form onSubmit={handleSave} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-semibold text-[#6b4c4c] mb-1.5">{t.fullName}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={saving}
                className="w-full px-4 py-3 rounded-xl border border-[#fad4db]/60 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#e8294a]/10"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#6b4c4c] mb-1.5">{t.email}</label>
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={saving}
                  dir="ltr"
                  className="w-full px-4 py-3 rounded-xl border border-[#fad4db]/60 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#e8294a]/10"
                />
                <VerificationBadge verified={user.emailVerified} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#6b4c4c] mb-1.5">{t.phone}</label>
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={saving}
                  dir="ltr"
                  className="w-full px-4 py-3 rounded-xl border border-[#fad4db]/60 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#e8294a]/10"
                />
                <VerificationBadge verified={user.phoneVerified} />
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="btn-secondary inline-flex items-center gap-2 px-5 py-2.5 text-sm disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? t.processing : t.saveProfile}
            </button>
          </form>
        </section>

        <section className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className="text-lg font-semibold">{t.myPayments}</h2>
            <div className="flex flex-wrap items-center gap-2">
              {canRequestPayment ? (
                <Link href="/payment/request" className="btn-rose inline-flex items-center gap-2 px-4 py-2 text-sm">
                  <CreditCard size={16} />
                  {t.newPayment}
                </Link>
              ) : null}
              <Link href="/payment/my-requests" className="text-sm font-semibold text-[#3A8DDE] hover:underline">
                {t.seeAllPayments}
              </Link>
            </div>
          </div>

          {paymentsLoading ? (
            <SkeletonList count={3} className="h-16" />
          ) : payments.length === 0 ? (
            <p className="text-sm text-gray-500">{t.noPaymentRequestsYet}</p>
          ) : (
            <ul className="space-y-3">
              {payments.map((req) => (
                <li
                  key={req.id}
                  className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-[#FFF8FB] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold">{PAYMENT_METHOD_LABELS[req.method]}</p>
                    <p className="text-xs text-gray-500" dir="ltr">
                      {new Date(req.createdAt).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-GB')}
                    </p>
                  </div>
                  <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${paymentStatusClass(req.status)}`}>
                    {PAYMENT_STATUS_LABELS[req.status]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Link href="/files" className="rounded-[20px] border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E91E63]/10 text-[#E91E63]">
              <FileText size={20} />
            </div>
            <h2 className="text-lg font-semibold">{t.myFiles}</h2>
            <p className="mt-2 text-sm text-gray-500">{t.availableFiles}</p>
          </Link>

          <Link href="/appointments" className="rounded-[20px] border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#3A8DDE]/10 text-[#3A8DDE]">
              <CalendarDays size={20} />
            </div>
            <h2 className="text-lg font-semibold">{t.bookAppointment}</h2>
            <p className="mt-2 text-sm text-gray-500">{t.comingSoonCopy}</p>
          </Link>
        </section>
      </div>
    </main>
  );
}
