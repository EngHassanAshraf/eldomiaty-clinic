'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { filesApi } from '@/lib/api/files';
import { ApiError } from '@/lib/api/types';
import Skeleton from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';
import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PdfViewerProps {
  fileId: string;
  isPaidContent: boolean;
  userIsPaid: boolean;
}

export default function PdfViewer({ fileId, isPaidContent, userIsPaid }: PdfViewerProps) {
  const { accessToken, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const needsPaywall = isPaidContent && !userIsPaid;

  useEffect(() => {
    if (authLoading) return;
    if (!accessToken) {
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const data = needsPaywall
          ? await filesApi.getPreview(fileId)
          : await filesApi.getFullAccess(fileId);
        setSignedUrl(data.url);
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : 'فشل تحميل الملف';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fileId, needsPaywall, accessToken, authLoading]);

  const handleRequestAccess = () => {
    if (!accessToken) {
      router.push('/login');
      return;
    }
    router.push('/payment/request');
  };

  if (authLoading || loading) {
    return <Skeleton className="w-full h-[600px]" />;
  }

  if (!accessToken) {
    return (
      <div className="card-base glass p-8 text-center text-[#8a6a6a]">
        <p className="mb-4">يجب تسجيل الدخول لعرض الملف</p>
        <button onClick={() => router.push('/login')} className="btn-rose px-6 py-2">
          تسجيل الدخول
        </button>
      </div>
    );
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
      <iframe
        src={signedUrl}
        className="w-full h-[600px] rounded-2xl border border-[#fad4db]/50 shadow-rose"
        title="عرض الملف"
        sandbox="allow-scripts allow-same-origin"
      />

      {needsPaywall && (
        <div className="absolute bottom-0 inset-x-0 h-48 bg-linear-to-t from-white via-white/90 to-transparent rounded-b-2xl flex flex-col items-center justify-end pb-8 gap-3">
          <div className="flex items-center gap-2 text-[#2d1a1a] font-bold">
            <Lock size={18} className="text-[#e8294a]" />
            هذا المحتوى متاح للمشتركين فقط
          </div>
          <button
            onClick={handleRequestAccess}
            className="btn-rose gap-2 px-6 py-3"
          >
            اطلب تفعيل الاشتراك
          </button>
        </div>
      )}
    </div>
  );
}
