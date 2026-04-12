'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { paymentsApi } from '@/lib/api/payments';
import { PaymentRecord, ApiError } from '@/lib/api/types';
import Skeleton from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';

export default function PaymentsTab() {
  const { accessToken } = useAuth();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    const load = async () => {
      try {
        const data = await paymentsApi.getPayments(accessToken);
        setPayments(data);
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : 'فشل تحميل المدفوعات';
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
      </div>
    );
  }

  if (error) return <div className="text-center py-8 text-[#8a6a6a]">{error}</div>;
  if (payments.length === 0) return <div className="text-center py-8 text-[#8a6a6a]">لا توجد مدفوعات</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#fad4db]/40">
            <th className="text-right py-3 px-4 font-semibold text-[#6b4c4c]">المستخدم</th>
            <th className="text-right py-3 px-4 font-semibold text-[#6b4c4c]">المبلغ</th>
            <th className="text-right py-3 px-4 font-semibold text-[#6b4c4c]">الحالة</th>
            <th className="text-right py-3 px-4 font-semibold text-[#6b4c4c]">التاريخ</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id} className="border-b border-[#fad4db]/20 hover:bg-[#fff0f3]/30 transition-colors">
              <td className="py-3 px-4 text-[#2d1a1a] text-xs" dir="ltr">{p.userId}</td>
              <td className="py-3 px-4 text-[#2d1a1a] font-semibold">
                {(p.amount / 100).toFixed(2)} {p.currency.toUpperCase()}
              </td>
              <td className="py-3 px-4">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  p.status === 'paid'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    : 'bg-gray-50 text-gray-600 border border-gray-200'
                }`}>
                  {p.status}
                </span>
              </td>
              <td className="py-3 px-4 text-[#8a6a6a] text-xs">
                {new Date(p.createdAt).toLocaleDateString('ar-EG')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
