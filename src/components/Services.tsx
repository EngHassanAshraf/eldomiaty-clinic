"use client";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { CLINIC } from "@/lib/data";
import { useLocale } from "@/lib/LocaleContext";
import { UI, SERVICES_I18N } from "@/lib/i18n";

export default function Services() {
  const { locale } = useLocale();
  const t = UI[locale];

  const allCats = [t.catAll, ...t.cats];
  const [active, setActive] = useState<string>(t.catAll);

  // Reset active filter when locale changes to avoid stale category
  const activeCat = active;

  const filtered = activeCat === t.catAll
    ? SERVICES_I18N
    : SERVICES_I18N.filter((s) => s[locale].category === activeCat);

  return (
    <section id="services" className="section-padding bg-section-a">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="section-header">
          <span className="badge-secondary">{t.servicesBadge}</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#2d1a1a] mt-3 mb-2 tracking-tight">
            {t.servicesTitle} <span className="text-grad-secondary">{t.servicesHighlight}</span>
          </h2>
          <div className="divider-primary" />
          <p className="text-[#6b7280] max-w-xl mx-auto mt-4 text-sm leading-relaxed">{t.servicesDesc}</p>
        </div>

        {/* Filter tabs with background image */}
        <div className="relative rounded-2xl overflow-hidden mb-10 min-h-[220px] sm:min-h-[280px] flex items-center justify-center shadow-subtle">
          {/* Background */}
          <Image
            src="/services-image.jpg"
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
            loading="lazy"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/55" aria-hidden="true" />

          {/* Buttons */}
          <div className="relative z-10 flex flex-wrap justify-center gap-2 px-6 py-10">
            {allCats.map((cat) => (
              <button key={cat} onClick={() => setActive(cat)}
                className={active === cat
                  ? "grad-secondary text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-primary transition-all duration-200"
                  : "bg-white/20 text-white border border-white/40 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/35 hover:border-white/70 transition-all duration-200 cursor-pointer backdrop-blur-sm"
                }>
                {cat}
              </button>
            ))}
          </div>
        </div>        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((s) => (
            <div key={s.id} className="card-base p-5 text-center cursor-default min-h-[120px] flex flex-col items-center justify-center gap-2">
              <div className="text-3xl">{s.icon}</div>
              <p className="text-sm font-semibold text-[#6b4c4c] leading-tight">{s[locale].title}</p>
              <span className="text-[10px] font-medium text-[#E91E63] bg-[#FCE4EC]/60 px-2 py-0.5 rounded-full border border-[#E91E63]/20">
                {s[locale].category}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a href={CLINIC.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-secondary px-8 py-4 text-base gap-2">
            <MessageCircle size={20} />{t.ctaFull}
          </a>
        </div>
      </div>
    </section>
  );
}
