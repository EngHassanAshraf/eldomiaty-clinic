"use client";
import { Phone, MessageCircle, Calendar } from "lucide-react";
import { CLINIC } from "@/lib/data";
import { useLocale } from "@/lib/LocaleContext";
import { UI } from "@/lib/i18n";

export default function MobileCTA() {
  const { locale } = useLocale();
  const t = UI[locale];

  return (
    <div className="mobile-cta-bar md:hidden flex items-center px-2 py-2 gap-1">
      <a href={`tel:${CLINIC.phone}`} aria-label={t.callUs}
        className="flex-1 flex flex-col items-center gap-0.5 py-2 text-[#6b4c4c] hover:text-[#E91E63] transition-colors active:scale-95 min-h-[44px] justify-center">
        <Phone size={20} />
        <span className="text-[10px] font-semibold">{t.call}</span>
      </a>
      <a href={CLINIC.whatsappLink} target="_blank" rel="noopener noreferrer" aria-label={t.whatsapp}
        className="flex-1 flex flex-col items-center gap-0.5 py-2 text-emerald-600 hover:text-emerald-700 transition-colors active:scale-95 min-h-[44px] justify-center">
        <MessageCircle size={20} />
        <span className="text-[10px] font-semibold">{t.whatsapp}</span>
      </a>
      <a href={CLINIC.whatsappLink} target="_blank" rel="noopener noreferrer" aria-label={t.cta}
        className="flex-[1.4] btn-secondary gap-1.5 text-xs py-3 mx-1 active:scale-95 min-h-[44px]">
        <Calendar size={15} />{t.cta}
      </a>
    </div>
  );
}
