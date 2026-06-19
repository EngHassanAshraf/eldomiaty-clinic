'use client';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { usersApi } from '@/lib/api/users';
import { PaginatedUsers, User, ApiError } from '@/lib/api/types';
import Skeleton from '@/components/ui/Skeleton';
import PaymentBadge from '@/components/ui/PaymentBadge';
import toast from 'react-hot-toast';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function UsersTab() {
  const { accessToken } = useAuth();
  const [data, setData] = useState<PaginatedUsers | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ user: User; isPaid: boolean } | null>(null);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const result = await usersApi.getUsers(accessToken, page, 20);
      setData(result);
      setError(null);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'فشل تحميل المستخدمين';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [accessToken, page]);

  useEffect(() => {
    load();
  }, [load]);

  const closeConfirm = () => {
    if (actingId) return;
    setConfirm(null);
  };

  const handleConfirm = async () => {
    if (!accessToken || !confirm) return;
    const { user, isPaid } = confirm;
    setActingId(user.id);
    try {
      const updated = await usersApi.updateIsPaid(user.id, isPaid, accessToken);
      setData((prev) =>
        prev
          ? { ...prev, data: prev.data.map((u) => (u.id === updated.id ? updated : u)) }
          : prev
      );
      toast.success(isPaid ? 'تم تفعيل الاشتراك' : 'تم إلغاء الاشتراك');
      setConfirm(null);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'فشل تحديث حالة الدفع');
    } finally {
      setActingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
      </div>
    );
  }

  if (error) return <div className="text-center py-8 text-[#8a6a6a]">{error}</div>;
  if (!data || data.data.length === 0) return <div className="text-center py-8 text-[#8a6a6a]">لا يوجد مستخدمون</div>;

  const isSubmitting = confirm !== null && actingId === confirm.user.id;

  return (
    <>
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#fad4db]/40">
                <th className="text-right py-3 px-4 font-semibold text-[#6b4c4c]">البريد الإلكتروني</th>
                <th className="text-right py-3 px-4 font-semibold text-[#6b4c4c]">الدور</th>
                <th className="text-right py-3 px-4 font-semibold text-[#6b4c4c]">حالة الدفع</th>
                <th className="text-right py-3 px-4 font-semibold text-[#6b4c4c]">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((user) => (
                <tr key={user.id} className="border-b border-[#fad4db]/20 hover:bg-[#fff0f3]/30 transition-colors">
                  <td className="py-3 px-4 text-[#2d1a1a]" dir="ltr">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      user.role === 'ADMIN'
                        ? 'bg-[#fff0f3] text-[#e8294a] border border-[#fad4db]/60'
                        : 'bg-gray-50 text-gray-600 border border-gray-200'
                    }`}>
                      {user.role === 'ADMIN' ? 'مدير' : 'مستخدم'}
                    </span>
                  </td>
                  <td className="py-3 px-4"><PaymentBadge isPaid={user.isPaid} /></td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => setConfirm({ user, isPaid: !user.isPaid })}
                      disabled={actingId === user.id}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#fad4db]/60 text-[#6b4c4c] hover:border-[#e8294a]/40 hover:text-[#e8294a] transition-colors disabled:opacity-50"
                    >
                      {user.isPaid ? 'إلغاء الاشتراك' : 'تفعيل الاشتراك'}
                    </button>
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
            <span className="text-sm text-[#8a6a6a]">{page} / {data.meta.totalPages}</span>
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
              {confirm.isPaid ? 'تأكيد تفعيل الاشتراك' : 'تأكيد إلغاء الاشتراك'}
            </h3>
            <p className="text-sm text-[#8a6a6a] leading-relaxed" dir="ltr">
              {confirm.user.email}
            </p>
            <p className="text-sm text-[#8a6a6a] leading-relaxed">
              {confirm.isPaid
                ? 'سيتمكن المستخدم من الوصول الكامل للمحتوى المدفوع.'
                : 'سيفقد المستخدم الوصول الكامل للمحتوى المدفوع.'}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isSubmitting}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 ${
                  confirm.isPaid
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {isSubmitting ? 'جارى التنفيذ...' : 'تأكيد'}
              </button>
              <button
                type="button"
                onClick={closeConfirm}
                disabled={isSubmitting}
                className="flex-1 btn-outline-rose py-2.5 text-sm disabled:opacity-60"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
