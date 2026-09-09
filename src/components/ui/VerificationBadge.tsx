import { useLocale } from '@/lib/LocaleContext';
import { UI } from '@/lib/i18n';
import { CheckCircleIcon, ClockIcon } from 'lucide-react';

export default function VerificationBadge({ verified }: { verified: boolean }) {
  const { locale } = useLocale();
  const t = UI[locale];

  if (verified) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
        <CheckCircleIcon className="w-3 h-3" />
        {t.verified}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#fff0f3] text-[var(--primary)] border border-[rgba(232,41,74,0.20)]">
      <ClockIcon className="w-3 h-3" />
      {t.unverified}
    </span>
  );
}
