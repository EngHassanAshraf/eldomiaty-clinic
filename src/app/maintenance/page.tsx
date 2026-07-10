'use client';

import { useEffect, useState } from 'react';
import Skeleton from '@/components/ui/Skeleton';

type MaintenanceStatus = {
  enabled: boolean;
  message?: string;
  clinicName?: string;
};

export default function MaintenancePage() {
  const [data, setData] = useState<MaintenanceStatus | null>(null);

  useEffect(() => {
    fetch('/api/settings/maintenance', { cache: 'no-store' })
      .then((r) => r.json())
      .then((json) => setData(json as MaintenanceStatus))
      .catch(() => setData({ enabled: true }));
  }, []);

  const clinicName = data?.clinicName || 'العيادة';
  const message =
    data?.message ??
    'نقوم حالياً بأعمال صيانة وتحسينات. برجاء المحاولة مرة أخرى بعد قليل.';

  return (
    <div className="min-h-screen bg-section-b section-padding flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="card-base glass p-10 text-center space-y-4">
          <div className="badge-rose w-fit mx-auto">صيانة</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2d1a1a]">
            {clinicName}
          </h1>
          {!data ? (
            <Skeleton className="h-5 w-full" />
          ) : (
          <p className="text-sm text-[#8a6a6a] leading-relaxed">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

