import { useLocale } from '@/lib/LocaleContext';
import { UI } from "@/lib/i18n";
import { CheckCircleIcon, ClockIcon } from 'lucide-react';

export default function PaymentBadge({ isPaid }: { isPaid: boolean }) {
  const { locale } = useLocale();
  const t = UI[locale];

  if (isPaid) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
        <CheckCircleIcon className="w-4 h-4" />
        {t.paid}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#fff0f3] text-[var(--primary)] border border-[rgba(232,41,74,0.20)]">
      <ClockIcon className="w-4 h-4" />
      {t.unpaid}
    </span>
  );
}
