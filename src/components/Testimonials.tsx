"use client";
import { useState, useCallback } from "react";
import { ChevronRight, ChevronLeft, Quote, MessageCircle } from "lucide-react";
import { CLINIC } from "@/lib/data";
import { useLocale } from "@/lib/LocaleContext";
import { UI, TESTIMONIALS_I18N } from "@/lib/i18n";

const AVATAR_COLORS = [
  "from-[#E91E63] to-[#F06292]",
  "from-[#3A8DDE] to-[#64B5F6]",
  "from-[#C2185B] to-[#E91E63]",
];

export default function Testimonials() {
  const { locale } = useLocale();
  const t = UI[locale];
  const [idx, setIdx] = useState(0);

  const prev = useCallback(() => {
    setIdx((i) => { const n = i - 3; return n < 0 ? Math.floor((TESTIMONIALS_I18N.length - 1) / 3) * 3 : n; });
  }, []);
  const next = useCallback(() => {
    setIdx((i) => { const n = i + 3; return n >= TESTIMONIALS_I18N.length ? 0 : n; });
  }, []);

  const visible = [0, 1, 2].map((o) => TESTIMONIALS_I18N[(idx + o) % TESTIMONIALS_I18N.length]);

  return (
    <section id="testimonials" className="section-padding bg-section-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="section-header">
          <span className="badge-primary">{t.testimonialsBadge}</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#2d1a1a] mt-3 mb-2 tracking-tight">
            {t.testimonialsTitle} <span className="text-grad-primary">{t.testimonialsHighlight}</span>
          </h2>
          <div className="divider-primary" />
          <p className="text-[#6b7280] mt-4 text-sm leading-relaxed">{t.testimonialsDesc}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {visible.map((item, i) => {
            const review = item[locale];
            return (
              <div key={`${item.id}-${i}-${idx}`}
                className={`card-base p-6 relative transition-all duration-300 ${i === 1 ? "border-t-4 border-t-[#E91E63] shadow-md z-10" : "opacity-90"} ${i !== 1 ? "hidden md:block" : ""}`}>
                <Quote size={20} className="text-[#FCE4EC] rotate-180 mb-3" />
                <p className="text-[#6b7280] leading-[1.75] mb-5 text-sm">{review.text}</p>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <div className={`w-11 h-11 rounded-full bg-linear-to-br ${AVATAR_COLORS[i]} flex items-center justify-center text-white font-bold text-base shrink-0`}>
                    {review.author[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#2d1a1a]">{review.author}</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {[1,2,3,4,5].map((s) => <span key={s} className="text-[#E91E63] text-xs">★</span>)}
                    </div>
                  </div>
                  <span className="mr-auto text-[10px] text-[#9ca3af] font-medium">{t.patient}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-4 mb-10">
          <button onClick={prev} aria-label={t.prevReview}
            className="bg-white border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center hover:border-[#E91E63]/40 hover:bg-[#FCE4EC]/40 active:scale-95 transition-all duration-200">
            <ChevronRight size={18} className="text-[#6b4c4c]" />
          </button>
          <div className="flex gap-2 items-center">
            {Array.from({ length: Math.ceil(TESTIMONIALS_I18N.length / 3) }).map((_, di) => (
              <button key={di} onClick={() => setIdx(di * 3)}
                className={`rounded-full transition-all duration-300 ${Math.floor(idx / 3) === di ? "w-6 h-2.5 grad-primary" : "w-2.5 h-2.5 bg-gray-200 hover:bg-gray-300"}`}
                aria-label={`${t.page} ${di + 1}`} />
            ))}
          </div>
          <button onClick={next} aria-label={t.nextReview}
            className="bg-white border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center hover:border-[#E91E63]/40 hover:bg-[#FCE4EC]/40 active:scale-95 transition-all duration-200">
            <ChevronLeft size={18} className="text-[#6b4c4c]" />
          </button>
        </div>

        <div className="text-center">
          <a href={CLINIC.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-primary gap-2 px-8 py-4 text-base">
            <MessageCircle size={20} />{t.ctaFull}
          </a>
        </div>
      </div>
    </section>
  );
}
