'use client';

import { useEffect, useState } from 'react';
import Skeleton from '@/components/ui/Skeleton';

import { UI } from '@/lib/i18n';
import { useLocale } from '@/lib/LocaleContext';

type MaintenanceStatus = {
  enabled: boolean;
  message?: string;
  clinicName?: string;
};

export default function MaintenancePage() {
  const [data, setData] = useState<MaintenanceStatus | null>(null);
  const { locale } = useLocale();
  const t = UI[locale];
  useEffect(() => {
    fetch('/api/settings/maintenance', { cache: 'no-store' })
      .then((r) => r.json())
      .then((json) => setData(json as MaintenanceStatus))
      .catch(() => setData({ enabled: true }));
  }, []);

  const clinicName = data?.clinicName || t.clinic;
  const message =
    data?.message ||
    t.maintenanceMessage;

  return (
    <div className="min-h-screen bg-section-b section-padding flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="card-base glass p-10 text-center space-y-4">
          <div className="badge-primary w-fit mx-auto">{t.maintenance}</div>
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

