'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { paymentRequestsApi } from '@/lib/api/payment-requests';
import { ApiError, PaymentMethod, PaymentRequestRecord, PaymentStatus } from '@/lib/api/types';
import Skeleton from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';

const METHOD_LABELS: Record<PaymentMethod, string> = {
  BANK_TRANSFER: 'تحويل بنكي',
  INSTAPAY: 'إنستاباي',
  VODAFONE_CASH: 'فودافون كاش',
  ORANGE_CASH: 'أورانج كاش',
  ETISALAT_CASH: 'اتصالات كاش',
};

const STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: 'قيد المراجعة',
  APPROVED: 'مقبول',
  REJECTED: 'مرفوض',
};

function statusClass(status: PaymentStatus) {
  if (status === 'APPROVED') {
    return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
  }
  if (status === 'REJECTED') {
    return 'bg-red-50 text-red-700 border border-red-200/60';
  }
  return 'bg-amber-50 text-amber-700 border border-amber-200/60';
}

export default function MyPaymentRequestsPage() {
  const { accessToken, isLoading: authLoading, refreshAuth } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<PaymentRequestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!accessToken) {
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        await refreshAuth();
        const data = await paymentRequestsApi.listMine(accessToken);
        setRequests(data);
        setError(null);
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : 'فشل تحميل الطلبات';
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [accessToken, authLoading, refreshAuth]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-section-b section-padding">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-64" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="min-h-screen bg-section-b section-padding">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="card-base glass p-8 text-center text-[#8a6a6a]">
            <p className="mb-4">يجب تسجيل الدخول لعرض طلباتك</p>
            <button onClick={() => router.push('/login')} className="btn-rose px-6 py-2">
              تسجيل الدخول
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-section-b section-padding">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <Link
          href="/files"
          className="inline-flex items-center gap-2 text-sm text-[#8a6a6a] hover:text-[#e8294a] transition-colors mb-6"
        >
          <ArrowRight size={16} />
          العودة إلى الملفات
        </Link>

        <div className="section-header mb-8">
          <span className="badge-rose">الاشتراك</span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#2d1a1a] mt-3 mb-2 tracking-tight">
            طلبات <span className="text-grad-rose">الدفع</span>
          </h1>
          <div className="divider-rose" />
        </div>

        {error ? (
          <div className="card-base glass p-8 text-center text-[#8a6a6a]">{error}</div>
        ) : requests.length === 0 ? (
          <div className="card-base glass p-8 text-center space-y-4">
            <p className="text-[#8a6a6a]">لم ترسل أي طلبات دفع بعد.</p>
            <Link href="/payment/request" className="btn-rose inline-block px-6 py-2.5">
              إرسال طلب جديد
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="card-base glass p-6">
                <div className="flex items-start gap-3">
                  <div className="grad-rose rounded-xl p-2.5 shrink-0">
                    <CreditCard size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-bold text-sm text-[#2d1a1a]">
                        {METHOD_LABELS[req.method]}
                      </p>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusClass(req.status)}`}
                      >
                        {STATUS_LABELS[req.status]}
                      </span>
                    </div>
                    <p className="text-xs text-[#8a6a6a]">
                      تاريخ الإرسال:{' '}
                      {new Date(req.createdAt).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    {req.adminNotes && (
                      <div className="text-sm text-[#6b4c4c] p-3 rounded-xl bg-[#fff8f9] border border-[#fad4db]/40">
                        <span className="font-semibold text-[#2d1a1a]">ملاحظات الإدارة: </span>
                        {req.adminNotes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
