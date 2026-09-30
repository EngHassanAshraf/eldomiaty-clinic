"use client";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { CLINIC } from "@/lib/data";
import { useLocale } from "@/lib/LocaleContext";
import { UI, SERVICES_I18N, resources } from "@/lib/i18n";

export default function Services() {
  const { locale } = useLocale();
  const t = UI[locale];
  const copy = resources[locale];

  const allCats = [t.catAll, ...t.cats];
  const [active, setActive] = useState<string>(t.catAll);

  const filtered =
    active === t.catAll
      ? SERVICES_I18N
      : SERVICES_I18N.filter((s) => s[locale].category === active);

  useEffect(() => {
    setActive(t.catAll);
  }, [locale, t.catAll]);

  return (
    <section id="services" className="section-padding bg-section-a">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="section-header">
          <span className="badge-secondary">{t.servicesBadge}</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#2d1a1a] mt-3 mb-2 tracking-tight">
            {t.servicesTitle} <span className="text-grad-secondary">{t.servicesHighlight}</span>
          </h2>
          <div className="divider-primary" />
          <p className="text-[#6b7280] max-w-2xl mx-auto mt-4 text-sm leading-relaxed">
            {copy.about.intro}
          </p>
        </div>

        {/* Filter tabs with background image */}
        <div className="relative rounded-xl overflow-hidden mb-10 min-h-45 sm:min-h-70 flex items-end justify-center shadow-subtle">
          <Image
            src="/images/services-image.jpg"
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, 1152px"
          />

          <div
            className="absolute inset-0 bg-black/30"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-wrap justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-3 sm:py-5">
            {allCats.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={
                  active === cat
                    ? "grad-secondary text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold shadow-primary transition-all duration-200"
                    : "bg-white/20 text-white border border-white/40 px-2 py-1 sm:px-4 sm:py-2 rounded-b-sm sm:rounded-b-lg text-xs sm:text-sm font-medium sm:font-semibold hover:bg-white/35 hover:border-white/70 transition-all duration-200 cursor-pointer backdrop-blur-sm"
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="card-base p-3 text-center cursor-default min-h-20 flex flex-col items-center justify-center gap-2"
            >
              <div className="text-xl">{s.icon}</div>
              <p className="text-xs font-medium text-[#6b4c4c] leading-tight">{s[locale].title}</p>
              <span className="text-[8px] font-medium text-[#E91E63] bg-[#FCE4EC]/60 px-2 py-0.5 rounded-full border border-[#E91E63]/20">
                {s[locale].category}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
