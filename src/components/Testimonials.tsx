"use client";
import { useState, useCallback } from "react";
import { ChevronRight, ChevronLeft, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/data";

const AVATAR_COLORS = [
  "from-[#e8294a] to-[#f25c74]",
  "from-[#f25c74] to-[#fad4db]",
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
    <section id="testimonials" className="section-padding bg-section-a">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="section-header">
          <span className="badge-rose">آراء المرضى</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#2d1a1a] mt-3 mb-2 tracking-tight">
            ماذا يقول <span className="text-grad-rose">عملائنا</span>
          </h2>
          <div className="divider-rose" />
          <p className="text-[#8a6a6a] mt-4 text-sm leading-relaxed">
            آراء حقيقية من مرضى وثقوا بنا في أهم لحظات حياتهم
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {visible.map((t, i) => (
            <div
              key={`${t.id}-${i}-${idx}`}
              className={`p-6 transition-all duration-400 ${
                i === 1
                  ? "card-base scale-[1.04] shadow-rose-lg border-[#fad4db]/80 z-10 relative"
                  : "card-base opacity-90 scale-[0.98]"
              }`}
            >
              {/* Top accent line for center card */}
              {i === 1 && (
                <div aria-hidden="true" className="absolute top-0 inset-x-0 h-1 grad-rose rounded-t-[1.25rem]" />
              )}

              {/* Quote icon */}
              <Quote size={20} className="text-[#fad4db] rotate-180 mb-2" />

              {/* Quote text */}
              <p className="text-[#6b4c4c] leading-[1.75] mb-5 text-sm">{t.text}</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-3 border-t border-[#fad4db]/40">
                <div className={`w-12 h-12 rounded-full bg-linear-to-br ${AVATAR_COLORS[i]} flex items-center justify-center text-white font-bold text-lg shadow-rose shrink-0`}>
                  {t.author[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#2d1a1a]">{t.author}</p>
                  <div className="flex gap-0.5 mt-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="text-[#e8294a] text-xs drop-shadow-sm">★</span>
                    ))}
                  </div>
                </div>
                <span className="mr-auto text-[10px] text-[#c4a0a0] font-medium">مريضة</span>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prev}
            aria-label="السابق"
            className="glass border border-[#fad4db]/70 rounded-full w-10 h-10 flex items-center justify-center hover:border-[#e8294a]/50 active:scale-95 transition-all duration-200"
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
                    ? "w-7 h-2.5 grad-rose"
                    : "w-2.5 h-2.5 bg-[#fad4db] hover:bg-[#f25c74]"
                }`}
                aria-label={`الصفحة ${di + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="التالى"
            className="glass border border-[#fad4db]/70 rounded-full w-10 h-10 flex items-center justify-center hover:border-[#e8294a]/50 active:scale-95 transition-all duration-200"
          >
            <ChevronLeft size={18} className="text-[#6b4c4c]" />
          </button>
        </div>
      </div>
    </section>
  );
}
