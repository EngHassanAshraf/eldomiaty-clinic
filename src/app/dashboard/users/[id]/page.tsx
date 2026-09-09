'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import VerificationBadge from '@/components/ui/VerificationBadge';
import PaymentBadge from '@/components/ui/PaymentBadge';
import Skeleton from '@/components/ui/Skeleton';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { usersApi } from '@/lib/api/users';
import { ApiError, User } from '@/lib/api/types';
import { useLocale } from '@/lib/LocaleContext';
import { UI } from '@/lib/i18n';
import { useParams } from 'next/navigation';

export default function AdminUserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { isLoading: authLoading, user: admin } = useRequireAuth({
    requiredRole: 'ADMIN',
    redirectTo: '/',
    replace: false,
  });
  const { locale } = useLocale();
  const t = UI[locale];
  const isRTL = locale === 'ar';

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);
  const [confirm, setConfirm] = useState<{ type: 'isPaid' | 'isActive'; value: boolean } | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await usersApi.getUser(id);
      setUser(data);
      setError(null);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : t.genericError;
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [id, t.genericError]);

  useEffect(() => {
    if (authLoading || !admin) return;
    void load();
  }, [authLoading, admin, load]);

  const handleConfirm = async () => {
    if (!user || !confirm) return;
    setActing(true);
    try {
      const updated = await usersApi.updateUser(
        user.id,
        confirm.type === 'isPaid' ? { isPaid: confirm.value } : { isActive: confirm.value }
      );
      setUser(updated);
      if (confirm.type === 'isPaid') {
        toast.success(confirm.value ? t.subscriptionActivated : t.subscriptionCancelled);
      } else {
        toast.success(confirm.value ? t.profileActivated : t.profileDeactivated);
      }
      setConfirm(null);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : t.genericError;
      if (msg === 'cannot-deactivate-self') toast.error(t.cannotDeactivateSelf);
      else toast.error(msg);
    } finally {
      setActing(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-section-a section-padding">
        <div className="max-w-3xl mx-auto px-4 py-25 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-section-a section-padding">
        <div className="max-w-3xl mx-auto px-4 py-25 text-center text-[#8a6a6a]">{error ?? t.noUsersFound}</div>
      </div>
    );
  }

  const isSelf = admin?.id === user.id;

  return (
    <div className="min-h-screen bg-section-a section-padding">
      <div className="max-w-3xl mx-auto px-4 py-25 sm:px-6 space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-[#8a6a6a] hover:text-[#e8294a] transition-colors"
        >
          <ArrowRight size={16} className={isRTL ? '' : 'rotate-180'} />
          {t.backToUsers}
        </Link>

        <section className="card-base glass p-6 sm:p-8 space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#3A8DDE]">{t.userProfile}</p>
            <h1 className="text-2xl font-black text-[#2d1a1a] mt-1">{user.name}</h1>
          </div>

          <div className="space-y-3 text-sm">
            <div className={`flex flex-wrap items-center gap-2 ${isRTL ? 'justify-end' : ''}`}>
              <span className="text-[#8a6a6a]">{t.email}:</span>
              <span dir="ltr">{user.email}</span>
              <VerificationBadge verified={user.emailVerified} />
            </div>
            <div className={`flex flex-wrap items-center gap-2 ${isRTL ? 'justify-end' : ''}`}>
              <span className="text-[#8a6a6a]">{t.phone}:</span>
              <span dir="ltr">{user.phone}</span>
              <VerificationBadge verified={user.phoneVerified} />
            </div>
            <div className={`flex flex-wrap items-center gap-2 ${isRTL ? 'justify-end' : ''}`}>
              <span className="text-[#8a6a6a]">{t.role}:</span>
              <span>{user.role === 'ADMIN' ? t.admin : t.user}</span>
            </div>
            <div className={`flex flex-wrap items-center gap-2 ${isRTL ? 'justify-end' : ''}`}>
              <span className="text-[#8a6a6a]">{t.paymentStatus}:</span>
              <PaymentBadge isPaid={user.isPaid} />
            </div>
            <div className={`flex flex-wrap items-center gap-2 ${isRTL ? 'justify-end' : ''}`}>
              <span className="text-[#8a6a6a]">{t.accountStatus}:</span>
              <span
                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                  user.isActive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                {user.isActive ? t.accountActive : t.accountInactive}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => setConfirm({ type: 'isPaid', value: !user.isPaid })}
              disabled={acting}
              className="btn-outline-rose text-sm px-4 py-2 disabled:opacity-50"
            >
              {user.isPaid ? t.cancelSubscription : t.activateSubscription}
            </button>
            <button
              type="button"
              onClick={() => setConfirm({ type: 'isActive', value: !user.isActive })}
              disabled={acting || (isSelf && user.isActive)}
              className="btn-outline-rose text-sm px-4 py-2 disabled:opacity-50"
              title={isSelf && user.isActive ? t.cannotDeactivateSelf : undefined}
            >
              {user.isActive ? t.deactivateProfile : t.activateProfile}
            </button>
          </div>
        </section>
      </div>

      {confirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onClick={() => !acting && setConfirm(null)}
          role="presentation"
        >
          <div
            className="card-base glass w-full max-w-md p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h3 className="text-lg font-black text-[#2d1a1a]">
              {confirm.type === 'isPaid'
                ? confirm.value
                  ? t.confirmSubscriptionActivation
                  : t.confirmSubscriptionCancellation
                : confirm.value
                  ? t.confirmProfileActivation
                  : t.confirmProfileDeactivation}
            </h3>
            <p className="text-sm text-[#8a6a6a]" dir="ltr">{user.email}</p>
            <p className="text-sm text-[#8a6a6a]">
              {confirm.type === 'isPaid'
                ? confirm.value
                  ? t.subscriptionWillBeActivated
                  : t.subscriptionWillBeCancelled
                : confirm.value
                  ? t.profileWillBeActivated
                  : t.profileWillBeDeactivated}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={acting}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 ${
                  confirm.value ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {acting ? t.processing : t.confirm}
              </button>
              <button
                type="button"
                onClick={() => setConfirm(null)}
                disabled={acting}
                className="flex-1 btn-outline-rose py-2.5 text-sm disabled:opacity-60"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
