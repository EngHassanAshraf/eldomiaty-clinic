'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function PaymentRequestSubmittedPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          router.push('/files');
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-hero-premium flex items-center justify-center px-4">
      <div className="card-base glass p-10 text-center max-w-md w-full space-y-5">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle size={36} className="text-emerald-500" />
          </div>
        </div>
        <h1 className="text-2xl font-black text-[#2d1a1a]">تم استلام طلبك</h1>
        <p className="text-[#8a6a6a] text-sm leading-relaxed">
          طلب تفعيل الاشتراك قيد المراجعة. ستتمكن من الوصول الكامل للمحتوى المدفوع بعد موافقة
          الإدارة.
        </p>
        <p className="text-xs text-[#c4a0a0]">
          سيتم تحويلك إلى الملفات خلال {countdown} ثوانٍ
        </p>
        <button onClick={() => router.push('/files')} className="btn-rose w-full py-3">
          الذهاب إلى الملفات الآن
        </button>
      </div>
    </div>
  );
}
