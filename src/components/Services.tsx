"use client";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { CLINIC } from "@/lib/data";
import { useLocale } from "@/lib/LocaleContext";
import { UI, SERVICES_I18N, resources } from "@/lib/i18n";

const FEATURED_KEYS = ["endoscopy", "icsi", "oncology", "highRiskPregnancy"] as const;

const FEATURED_STYLES = [
  { emoji: "🔬", bg: "bg-rose-50", border: "border-rose-200/60" },
  { emoji: "💝", bg: "bg-amber-50", border: "border-amber-200/60" },
  { emoji: "🏥", bg: "bg-emerald-50", border: "border-emerald-200/60" },
  { emoji: "⚕️", bg: "bg-violet-50", border: "border-violet-200/60" },
] as const;

export default function Services() {
  const { locale } = useLocale();
  const t = UI[locale];
  const copy = resources[locale];

  const allCats = [t.catAll, ...t.cats];
  const [active, setActive] = useState<string>(t.catAll);

  const featured = FEATURED_KEYS.map((key, i) => ({
    key,
    ...copy.services[key],
    ...FEATURED_STYLES[i],
  }));

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
          {featured.map((service) => (
            <div
              key={service.key}
              className={`${service.bg} border ${service.border} rounded-xl p-5 text-start h-full cursor-default transition-colors duration-200 hover:border-[#E91E63]/40`}
            >
              <div className="text-2xl mb-2">{service.emoji}</div>
              <p className="text-sm font-semibold text-[#2d1a1a] mb-1.5">{service.title}</p>
              <p className="text-xs text-[#6b7280] leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs with background image */}
        <div className="relative rounded-2xl overflow-hidden mb-10 min-h-[220px] sm:min-h-[280px] flex items-center justify-center shadow-subtle">
          <Image
            src="/services-image.jpg"
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-black/55" aria-hidden="true" />

          <div className="relative z-10 flex flex-wrap justify-center gap-2 px-6 py-10">
            {allCats.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={
                  active === cat
                    ? "grad-secondary text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-primary transition-all duration-200"
                    : "bg-white/20 text-white border border-white/40 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/35 hover:border-white/70 transition-all duration-200 cursor-pointer backdrop-blur-sm"
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="card-base p-5 text-center cursor-default min-h-[120px] flex flex-col items-center justify-center gap-2"
            >
              <div className="text-3xl">{s.icon}</div>
              <p className="text-sm font-semibold text-[#6b4c4c] leading-tight">{s[locale].title}</p>
              <span className="text-[10px] font-medium text-[#E91E63] bg-[#FCE4EC]/60 px-2 py-0.5 rounded-full border border-[#E91E63]/20">
                {s[locale].category}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href={CLINIC.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary px-8 py-4 text-base gap-2"
          >
            <MessageCircle size={20} />
            {t.ctaFull}
          </a>
        </div>
      </div>
    </section>
  );
}
