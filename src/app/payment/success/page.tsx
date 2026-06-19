'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Legacy Stripe success URL — redirects to manual payment submitted page. */
export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/payment/request/submitted');
  }, [router]);

  return (
    <div className="min-h-screen bg-hero-premium flex items-center justify-center px-4">
      <p className="text-[#8a6a6a] text-sm">جارى التحويل...</p>
    </div>
  );
}
