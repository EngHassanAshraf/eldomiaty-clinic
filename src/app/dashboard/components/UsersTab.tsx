'use client';
import Link from 'next/link';
import SkeletonList from '@/components/ui/SkeletonList';
import PaymentBadge from '@/components/ui/PaymentBadge';
import toast from 'react-hot-toast';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { usersApi } from '@/lib/api/users';
import { PaginatedUsers, User, ApiError } from '@/lib/api/types';
import { ChevronRight, ChevronLeft, MoreHorizontal } from 'lucide-react';

import { useLocale } from '@/lib/LocaleContext';
import { UI } from '@/lib/i18n';

type ConfirmAction =
  | { user: User; type: 'isPaid'; value: boolean }
  | { user: User; type: 'isActive'; value: boolean };

function UserActionsMenu({
  user,
  isSelf,
  disabled,
  onAction,
  locale,
}: {
  user: User;
  isSelf: boolean;
  disabled: boolean;
  onAction: (action: ConfirmAction) => void;
  locale: 'ar' | 'en';
}) {
  const t = UI[locale];
  const [open, setOpen] = useState(false);
  const isRTL = locale === 'ar';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#fad4db]/60 text-[#6b4c4c] transition-colors hover:border-[#e8294a]/40 hover:text-[#e8294a] disabled:opacity-50"
        aria-label={t.actions}
      >
        <MoreHorizontal size={16} />
      </button>

      {open ? (
        <div
          className={`absolute z-20 mt-2 w-52 rounded-2xl border border-gray-200 bg-white p-2 shadow-[0_12px_32px_rgba(0,0,0,0.12)] ${
            isRTL ? 'left-0' : 'right-0'
          }`}
        >
          <button
            type="button"
            disabled={isSelf && user.isActive}
            onClick={() => {
              setOpen(false);
              onAction({ user, type: 'isActive', value: !user.isActive });
            }}
            className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-[#FDE8EF] hover:text-[#E91E63] disabled:opacity-40 disabled:hover:bg-transparent"
            title={isSelf && user.isActive ? t.cannotDeactivateSelf : undefined}
          >
            {user.isActive ? t.deactivateProfile : t.activateProfile}
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onAction({ user, type: 'isPaid', value: !user.isPaid });
            }}
            className="mt-1 flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-[#FDE8EF] hover:text-[#E91E63]"
          >
            {user.isPaid ? t.cancelSubscription : t.activateSubscription}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function UsersTab() {
  const { accessToken, user: currentUser } = useAuth();
  const [data, setData] = useState<PaginatedUsers | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ConfirmAction | null>(null);

  const { locale } = useLocale();
  const t = UI[locale];
  const isRTL = locale === 'ar';
  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const result = await usersApi.getUsers(page, 20);
      setData(result);
      setError(null);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : t.loading;
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [accessToken, page, t.loading]);

  useEffect(() => {
    load();
  }, [load]);

  const closeConfirm = () => {
    if (actingId) return;
    setConfirm(null);
  };

  const handleConfirm = async () => {
    if (!accessToken || !confirm) return;
    const { user, type, value } = confirm;
    setActingId(user.id);
    try {
      const updated = await usersApi.updateUser(
        user.id,
        type === 'isPaid' ? { isPaid: value } : { isActive: value }
      );
      setData((prev) =>
        prev
          ? { ...prev, data: prev.data.map((u) => (u.id === updated.id ? updated : u)) }
          : prev
      );
      if (type === 'isPaid') {
        toast.success(value ? t.subscriptionActivated : t.subscriptionCancelled);
      } else {
        toast.success(value ? t.profileActivated : t.profileDeactivated);
      }
      setConfirm(null);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : t.genericError;
      if (msg === 'cannot-deactivate-self') toast.error(t.cannotDeactivateSelf);
      else toast.error(msg);
    } finally {
      setActingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <SkeletonList count={5} className="h-12" />
      </div>
    );
  }

  if (error) return <div className="text-center py-8 text-[#8a6a6a]">{error}</div>;
  if (!data || data.data.length === 0) return <div className="text-center py-8 text-[#8a6a6a]">{t.noUsersFound}</div>;

  const isSubmitting = confirm !== null && actingId === confirm.user.id;
  return (
    <>
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#fad4db]/40">
                <th className={`text-${isRTL ? 'right' : 'left'} py-3 px-4 font-semibold text-[#6b4c4c]`}>{t.name}</th>
                <th className={`text-${isRTL ? 'right' : 'left'} py-3 px-4 font-semibold text-[#6b4c4c]`}>{t.email}</th>
                <th className={`text-${isRTL ? 'right' : 'left'} py-3 px-4 font-semibold text-[#6b4c4c]`}>{t.phone}</th>
                <th className={`text-${isRTL ? 'right' : 'left'} py-3 px-4 font-semibold text-[#6b4c4c]`}>{t.role}</th>
                <th className={`text-${isRTL ? 'right' : 'left'} py-3 px-4 font-semibold text-[#6b4c4c]`}>{t.accountStatus}</th>
                <th className={`text-${isRTL ? 'right' : 'left'} py-3 px-4 font-semibold text-[#6b4c4c]`}>{t.paymentStatus}</th>
                <th className={`text-${isRTL ? 'right' : 'left'} py-3 px-4 font-semibold text-[#6b4c4c]`}>{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((user) => (
                <tr
                  key={user.id}
                  className={`border-b border-[#fad4db]/20 hover:bg-[#fff0f3]/30 transition-colors ${
                    user.isActive ? '' : 'opacity-70'
                  }`}
                >
                  <td className={`py-3 px-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <Link
                      href={`/dashboard/users/${user.id}`}
                      className="font-semibold text-[#2d1a1a] hover:text-[#e8294a] hover:underline"
                      dir="ltr"
                    >
                      {user.name}
                    </Link>
                  </td>
                  <td className={`py-3 px-4 text-[#2d1a1a] ${isRTL ? 'text-right' : 'text-left'}`} dir="ltr">
                    {user.email}
                  </td>
                  <td className={`py-3 px-4 text-[#2d1a1a] ${isRTL ? 'text-right' : 'text-left'}`} dir="ltr">
                    {user.phone}
                  </td>
                  <td className={`py-3 px-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        user.role === 'ADMIN'
                          ? 'bg-[#fff0f3] text-[var(--primary)] border border-[rgba(232,41,74,0.20)]'
                          : 'bg-gray-50 text-gray-600 border border-gray-200'
                      }`}
                    >
                      {user.role === 'ADMIN' ? t.admin : t.user}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        user.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}
                    >
                      {user.isActive ? t.accountActive : t.accountInactive}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <PaymentBadge isPaid={user.isPaid} />
                  </td>
                  <td className="py-3 px-4">
                    <UserActionsMenu
                      user={user}
                      isSelf={currentUser?.id === user.id}
                      disabled={actingId === user.id}
                      onAction={setConfirm}
                      locale={locale}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-outline-rose text-xs px-3 py-1.5 disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
            <span className="text-sm text-[#8a6a6a]">
              {page} / {data.meta.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))}
              disabled={page === data.meta.totalPages}
              className="btn-outline-rose text-xs px-3 py-1.5 disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>
          </div>
        )}
      </div>

      {confirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onClick={closeConfirm}
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
            <p className="text-sm text-[#8a6a6a] leading-relaxed" dir="ltr">
              {confirm.user.email}
            </p>
            <p className="text-sm text-[#8a6a6a] leading-relaxed">
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
                disabled={isSubmitting}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 ${
                  confirm.value ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {isSubmitting ? t.processing : t.confirm}
              </button>
              <button
                type="button"
                onClick={closeConfirm}
                disabled={isSubmitting}
                className="flex-1 btn-outline-rose py-2.5 text-sm disabled:opacity-60"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
