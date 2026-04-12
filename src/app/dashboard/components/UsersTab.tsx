'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { usersApi } from '@/lib/api/users';
import { PaginatedUsers } from '@/lib/api/types';
import Skeleton from '@/components/ui/Skeleton';
import PaymentBadge from '@/components/ui/PaymentBadge';
import { ApiError } from '@/lib/api/types';
import toast from 'react-hot-toast';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function UsersTab() {
  const { accessToken } = useAuth();
  const [data, setData] = useState<PaginatedUsers | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    const load = async () => {
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
    };
    load();
  }, [accessToken, page]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
      </div>
    );
  }

  if (error) return <div className="text-center py-8 text-[#8a6a6a]">{error}</div>;
  if (!data || data.data.length === 0) return <div className="text-center py-8 text-[#8a6a6a]">لا يوجد مستخدمون</div>;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#fad4db]/40">
              <th className="text-right py-3 px-4 font-semibold text-[#6b4c4c]">البريد الإلكتروني</th>
              <th className="text-right py-3 px-4 font-semibold text-[#6b4c4c]">الدور</th>
              <th className="text-right py-3 px-4 font-semibold text-[#6b4c4c]">حالة الدفع</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
  );
}
