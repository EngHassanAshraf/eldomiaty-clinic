"use client";
import { MessageCircle } from "lucide-react";
import { CLINIC } from "@/lib/data";
import { useLocale } from "@/lib/LocaleContext";
import { UI } from "@/lib/i18n";

export default function WhatsAppFAB() {
  const { locale } = useLocale();
  const t = UI[locale];

  return (
    <a href={CLINIC.whatsappLink} target="_blank" rel="noopener noreferrer"
      aria-label={t.ctaAria}
      className="hidden md:flex fixed bottom-6 left-6 z-50 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full items-center justify-center hover:scale-110 transition-all duration-200"
      style={{ boxShadow: "0 8px 24px rgba(16,185,129,0.35)" }}>
      <MessageCircle size={26} />
      <span aria-hidden="true" className="absolute -top-1 -right-1 w-4 h-4 bg-[#E91E63] rounded-full border-2 border-white animate-pulse-ring" />
    </a>
  );
}
