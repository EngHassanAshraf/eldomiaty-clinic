"use client";
import { useState, useCallback } from "react";
import { ChevronRight, ChevronLeft, Quote, MessageCircle } from "lucide-react";
import { TESTIMONIALS, CLINIC } from "@/lib/data";

const AVATAR_COLORS = [
  "from-[#e8294a] to-[#f25c74]",
  "from-[#1a6eb5] to-[#2980d4]",
  "from-[#c0392b] to-[#e8294a]",
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);

  const prev = useCallback(() => {
    setIdx((i) => {
      const newIdx = i - 3;
      return newIdx < 0 ? Math.floor((TESTIMONIALS.length - 1) / 3) * 3 : newIdx;
    });
  }, []);

  const next = useCallback(() => {
    setIdx((i) => {
      const newIdx = i + 3;
      return newIdx >= TESTIMONIALS.length ? 0 : newIdx;
    });
  }, []);

  const visible = [0, 1, 2].map((offset) => TESTIMONIALS[(idx + offset) % TESTIMONIALS.length]);

  return (
    <section id="testimonials" className="section-padding bg-section-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="section-header">
          <span className="badge-primary">آراء المرضى</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#2d1a1a] mt-3 mb-2 tracking-tight">
            ماذا تقول <span className="text-grad-primary">مرضانا</span>
          </h2>
          <div className="divider-primary" />
          <p className="text-[#6b7280] mt-4 text-sm leading-relaxed">
            آراء حقيقية من مرضى وثقوا بنا في أهم لحظات حياتهم
          </p>
        </div>

        {/* Cards — 3 on desktop, 1 on mobile */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {visible.map((t, i) => (
            <div
              key={`${t.id}-${i}-${idx}`}
              className={`card-base p-6 relative transition-all duration-300 ${
                i === 1
                  ? "border-t-4 border-t-[#e8294a] shadow-md z-10"
                  : "opacity-90"
              } ${i !== 1 ? "hidden md:block" : ""}`}
            >
              {/* Quote icon */}
              <Quote size={20} className="text-[#fad4db] rotate-180 mb-3" />

              {/* Quote text */}
              <p className="text-[#6b7280] leading-[1.75] mb-5 text-sm">{t.text}</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div
                  className={`w-11 h-11 rounded-full bg-linear-to-br ${AVATAR_COLORS[i]} flex items-center justify-center text-white font-bold text-base shrink-0`}
                >
                  {t.author[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#2d1a1a]">{t.author}</p>
                  <div className="flex gap-0.5 mt-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="text-[#e8294a] text-xs">★</span>
                    ))}
                  </div>
                </div>
                <span className="mr-auto text-[10px] text-[#9ca3af] font-medium">مريضة</span>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation controls */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <button
            onClick={prev}
            aria-label="التقييم السابق"
            className="bg-white border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center hover:border-[#e8294a]/40 hover:bg-[#fff0f3] active:scale-95 transition-all duration-200"
          >
            <ChevronRight size={18} className="text-[#6b4c4c]" />
          </button>

          <div className="flex gap-2 items-center">
            {Array.from({ length: Math.ceil(TESTIMONIALS.length / 3) }).map((_, di) => (
              <button
                key={di}
                onClick={() => setIdx(di * 3)}
                className={`rounded-full transition-all duration-300 ${
                  Math.floor(idx / 3) === di
                    ? "w-6 h-2.5 grad-primary"
                    : "w-2.5 h-2.5 bg-gray-200 hover:bg-gray-300"
                }`}
                aria-label={`الصفحة ${di + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="التقييم التالى"
            className="bg-white border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center hover:border-[#e8294a]/40 hover:bg-[#fff0f3] active:scale-95 transition-all duration-200"
          >
            <ChevronLeft size={18} className="text-[#6b4c4c]" />
          </button>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href={CLINIC.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary gap-2 px-8 py-4 text-base"
          >
            <MessageCircle size={20} />
            احجز موعدك الآن
          </a>
        </div>

      </div>
    </section>
  );
}
