"use client";
import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import Image from "next/image";

import { CLINIC } from "@/lib/data";
import { useLocale } from "@/lib/LocaleContext";
import { UI, BRANCHES_I18N } from "@/lib/i18n";

const ACCENTS = [
  { text: "-grad-primary",top: "bg-primary", icon: "grad-primary" },
  { text: "-amber-400",top: "bg-amber-400", icon: "bg-linear-to-br from-orange-400 to-amber-400" },
  { text: "-emerald-500",top: "bg-emerald-500", icon: "bg-linear-to-br from-emerald-400 to-teal-500" },
  { text: "-violet-500",top: "bg-violet-500", icon: "bg-linear-to-br from-violet-400 to-purple-500" },
];

const ClinicMap = dynamic(() => import("@/components/ClinicMap"), {
  ssr: false,
  loading: () => (
    <div className="h-90 w-full rounded-2xl animate-pulse bg-[#faf7f5]" aria-label="Loading map" />
  ),
});

export default function Branches() {
  const { locale } = useLocale();
  const t = UI[locale];
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleLocationSelect = useCallback((id: number) => {
    setSelectedId(id);
    window.requestAnimationFrame(() => {
      cardRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }, []);

  return (
    <section id="branches" className="section-padding bg-section-a">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="section-header">
          <span className="badge-secondary">{t.branchesBadge}</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#2d1a1a] mt-3 mb-2 tracking-tight">
            {t.branchesTitle} <span className="text-grad-secondary">{t.branchesHighlight}</span>
          </h2>
          <div className="divider-primary" />
          <p className="text-[#6b7280] mt-4 text-sm">{t.branchesDesc}</p>
        </div>

        <div className="mb-8">
          <ClinicMap selectedId={selectedId} onSelect={handleLocationSelect} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BRANCHES_I18N.map((branch, i) => {
            const a = ACCENTS[i % 4];
            const b = branch[locale];
            return (
              <div
                key={branch.id}
                ref={(node) => { cardRefs.current[branch.id] = node; }}
                tabIndex={0}
                role="button"
                aria-pressed={selectedId === branch.id}
                aria-label={`${b.name}: ${b.address}`}
                onClick={() => handleLocationSelect(branch.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleLocationSelect(branch.id);
                  }
                }}
                className={`card-base overflow-hidden cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#E91E63] focus:ring-offset-2 ${selectedId === branch.id
                  ? "ring-2 ring-[#E91E63] shadow-card"
                  : "hover:shadow-card"
                  }`}
              >
                <div className={`h-1 ${a.top}`} />
                <div className="p-6 flex flex-col justify-between h-full">
                  <div className="w-full flex items-center mb-2">
                    <div className={`${a.icon} rounded-xl w-11 h-11 flex items-center justify-center text-white text-lg me-4 shadow-subtle`}>
                      {branch.icon}
                    </div>
                    <h3 className={`font-bold text${a.text}`}>{b.name}</h3>
                  </div>
                  <p className="mb-2 text-sm text-[#6b7280] leading-relaxed">{b.address}</p>
                  <a href={CLINIC.whatsappLink} target="_blank" rel="noopener noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="flex items-center gap-1.5 text-sm font-semibold text-[#E91E63] hover:text-[#C2185B] transition-colors">
                    <MapPin size={13} />{t.bookBranch}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative mt-10 overflow-hidden rounded-2xl shadow-subtle">
          {/* Background image */}
          <Image
            src="/images/contact-us.png"
            alt=""
            fill
            className="object-cover object-[15%_center] sm:object-center"
            aria-hidden="true"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, 1152px"
          />

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            aria-hidden="true"
          />

          {/* Content */}


          <div
            className="
              relative z-10
              min-h-70 sm:min-h-75
              pb-5 sm:px-8 sm:py-12
              flex items-end justify-center
              "
          >
            <div
              className="
              w-full h-full
              flex-col items-end justify-center
              "
            >
              <div className="flex flex-col justify-center items-center">
                <h3 className="text-sm sm:text-xl font-black text-white mb-2">
                  {t.contactNow}
                </h3>

                <p className="text-sm leading-relaxed text-white/85 mb-5">
                  {t.contactDesc}
                </p>
              </div>

              <div className="px-2 flex items-center justify-center gap-2.5 sm:w-auto sm:flex-row sm:gap-3">
                <a
                  href={`tel:${CLINIC.phone}`}
                  className="btn-secondary"
                >
                  <Phone size={16} />
                  <span dir="ltr">{t.callUs}</span>
                </a>

                <a
                  href={CLINIC.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-auto items-center justify-center gap-2"
                >
                  <MessageCircle size={16} />
                  {t.whatsapp}
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
