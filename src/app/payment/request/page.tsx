'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { paymentMethodsApi } from '@/lib/api/payment-methods';
import { paymentRequestsApi } from '@/lib/api/payment-requests';
import { ApiError, PaymentMethod, PaymentMethodSettingRecord } from '@/lib/api/types';
import toast from 'react-hot-toast';
import Skeleton from '@/components/ui/Skeleton';

export default function PaymentRequestPage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [methods, setMethods] = useState<PaymentMethodSettingRecord[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [method, setMethod] = useState<PaymentMethod | ''>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    paymentMethodsApi
      .listActive()
      .then((data) => {
        setMethods(data);
        if (data.length > 0) setMethod(data[0].method);
      })
      .catch(() => toast.error('فشل تحميل طرق الدفع'))
      .finally(() => setLoadingMethods(false));
  }, []);

  const selected = methods.find((m) => m.method === method);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      router.push('/login');
      return;
    }
    const file = fileInputRef.current?.files?.[0];
    if (!method) {
      toast.error('اختر طريقة الدفع');
      return;
    }
    if (!file) {
      toast.error('ارفع لقطة شاشة للتحويل');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('يجب أن تكون الصورة بصيغة JPEG أو PNG أو WebP');
      return;
    }

    const formData = new FormData();
    formData.append('method', method);
    formData.append('screenshot', file);

    setSubmitting(true);
    try {
      await paymentRequestsApi.submit(formData);
      toast.success('تم إرسال الطلب بنجاح');
      router.push('/payment/request/submitted');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'فشل إرسال الطلب');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-section-b section-padding">
      <div className="max-w-lg mx-auto px-4 sm:px-6">
        <Link
          href="/files"
          className="inline-flex items-center gap-2 text-sm text-[#8a6a6a] hover:text-[#e8294a] transition-colors mb-6"
        >
          <ArrowRight size={16} />
          العودة إلى الملفات
        </Link>

        <form onSubmit={handleSubmit} className="card-base glass p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-black text-[#2d1a1a] mb-2">طلب تفعيل الاشتراك</h1>
            <p className="text-sm text-[#8a6a6a] leading-relaxed">
              ادفع بإحدى الطرق المتاحة لدى العيادة، ثم ارفع لقطة شاشة للتحويل. سيراجع الطلب فريق
              الإدارة ويفعّل اشتراكك بعد الموافقة.
            </p>
          </div>

          {loadingMethods ? (
            <Skeleton className="h-32" />
          ) : methods.length === 0 ? (
            <p className="text-sm text-[#8a6a6a]">لا توجد طرق دفع متاحة حالياً.</p>
          ) : (
            <>
              <div className="space-y-2">
                <label htmlFor="method" className="text-sm font-semibold text-[#2d1a1a]">
                  طريقة الدفع
                </label>
                <select
                  id="method"
                  value={method}
                  onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                  disabled={submitting}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#fad4db]/60 bg-white text-sm text-[#2d1a1a] focus:outline-none focus:border-[#e8294a]/50 disabled:opacity-60"
                >
                  {methods.map((m) => (
                    <option key={m.method} value={m.method}>
                      {m.displayName}
                    </option>
                  ))}
                </select>
              </div>

              {selected && (
                <div className="text-sm text-[#6b4c4c] space-y-1 p-4 rounded-xl bg-[#fff8f9] border border-[#fad4db]/40">
                  {selected.accountName && <p>اسم الحساب: {selected.accountName}</p>}
                  {selected.accountNumber && <p dir="ltr">رقم الحساب: {selected.accountNumber}</p>}
                  {selected.instructions && <p>{selected.instructions}</p>}
                </div>
              )}

              <div className="space-y-3 p-4 rounded-xl border border-dashed border-[#fad4db]/60 bg-[#fff8f9]/50">
                <div className="flex items-center gap-2 text-[#8a6a6a] text-sm">
                  <Upload size={16} />
                  رفع لقطة شاشة الدفع
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={submitting}
                  className="text-sm text-[#6b4c4c] file:btn-rose file:text-xs file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || methods.length === 0}
                className="btn-rose w-full py-3 disabled:opacity-60"
              >
                {submitting ? 'جارى الإرسال...' : 'إرسال الطلب'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
