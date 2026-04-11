"use client";
import { Phone, MessageCircle, Calendar } from "lucide-react";
import { CLINIC } from "@/lib/data";

export default function MobileCTA() {
  return (
    <div className="mobile-cta-bar md:hidden safe-area-bottom flex">
      <a href={`tel:${CLINIC.phone}`}
        className="flex-1 flex flex-col items-center gap-0.5 py-1.5 text-[#6b4c4c] hover:text-[#e8294a] transition-colors active:scale-95">
        <Phone size={20} />
        <span className="text-[10px] font-semibold">اتصال</span>
      </a>
      <a href={CLINIC.whatsappLink} target="_blank" rel="noopener noreferrer"
        className="flex-1 flex flex-col items-center gap-0.5 py-1.5 text-emerald-600 hover:text-emerald-700 transition-colors active:scale-95">
        <MessageCircle size={20} />
        <span className="text-[10px] font-semibold">واتساب</span>
      </a>
      <a href={CLINIC.whatsappLink} target="_blank" rel="noopener noreferrer"
        className="flex-[1.4] btn-rose gap-1.5 text-xs py-2.5 mx-1 active:scale-95">
        <Calendar size={15} />
        احجز موعد
      </a>
    </div>
  );
}
