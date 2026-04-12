'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { filesApi } from '@/lib/api/files';
import { ApiError } from '@/lib/api/types';
import Skeleton from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';
import { Lock } from 'lucide-react';
import { paymentsApi } from '@/lib/api/payments';
import { useRouter } from 'next/navigation';

interface PdfViewerProps {
  fileId: string;
  isPaid: boolean;
}

export default function PdfViewer({ fileId, isPaid }: PdfViewerProps) {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    const load = async () => {
      try {
        const data = isPaid
          ? await filesApi.getFullAccess(fileId, accessToken)
          : await filesApi.getPreview(fileId, accessToken);
        setSignedUrl(data.url);
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : 'فشل تحميل الملف';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fileId, isPaid, accessToken]);

  const handleUnlock = async () => {
    if (!accessToken) { router.push('/login'); return; }
    setCheckoutLoading(true);
    try {
      const { url } = await paymentsApi.createCheckout(accessToken);
      window.location.href = url;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'فشل إنشاء جلسة الدفع';
      toast.error(msg);
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return <Skeleton className="w-full h-[600px]" />;
  }

  if (!signedUrl) {
    return (
      <div className="card-base glass p-8 text-center text-[#8a6a6a]">
        تعذر تحميل الملف
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* iframe — signed URL never exposed as href */}
      <iframe
        src={signedUrl}
        className="w-full h-[600px] rounded-2xl border border-[#fad4db]/50 shadow-rose"
        title="عرض الملف"
        sandbox="allow-scripts allow-same-origin"
      />

      {/* Upgrade overlay for unpaid users */}
      {!isPaid && (
        <div className="absolute bottom-0 inset-x-0 h-48 bg-linear-to-t from-white via-white/90 to-transparent rounded-b-2xl flex flex-col items-center justify-end pb-8 gap-3">
          <div className="flex items-center gap-2 text-[#2d1a1a] font-bold">
            <Lock size={18} className="text-[#e8294a]" />
            هذا المحتوى متاح للمشتركين فقط
          </div>
          <button
            onClick={handleUnlock}
            disabled={checkoutLoading}
            className="btn-rose gap-2 px-6 py-3 disabled:opacity-60"
          >
            {checkoutLoading ? 'جارى التحويل...' : 'اشترك للوصول الكامل'}
          </button>
        </div>
      )}
    </div>
  );
}
