"use client";
import { Phone, MessageCircle, Calendar } from "lucide-react";
import { CLINIC } from "@/lib/data";

export default function MobileCTA() {
  return (
    <div className="mobile-cta-bar md:hidden flex items-center px-2 py-2 gap-1">
      <a
        href={`tel:${CLINIC.phone}`}
        aria-label="اتصل بنا"
        className="flex-1 flex flex-col items-center gap-0.5 py-2 text-[#6b4c4c] hover:text-[#e8294a] transition-colors active:scale-95 min-h-[44px] justify-center"
      >
        <Phone size={20} />
        <span className="text-[10px] font-semibold">اتصال</span>
      </a>
      <a
        href={CLINIC.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل عبر واتساب"
        className="flex-1 flex flex-col items-center gap-0.5 py-2 text-emerald-600 hover:text-emerald-700 transition-colors active:scale-95 min-h-[44px] justify-center"
      >
        <MessageCircle size={20} />
        <span className="text-[10px] font-semibold">واتساب</span>
      </a>
      <a
        href={CLINIC.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="احجز موعد"
        className="flex-[1.4] btn-primary gap-1.5 text-xs py-3 mx-1 active:scale-95 min-h-[44px]"
      >
        <Calendar size={15} />
        احجز موعد
      </a>
    </div>
  );
}
