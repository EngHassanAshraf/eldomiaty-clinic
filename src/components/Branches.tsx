"use client";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import Image from "next/image";

import { CLINIC } from "@/lib/data";
import { useLocale } from "@/lib/LocaleContext";
import { UI, BRANCHES_I18N } from "@/lib/i18n";

const ACCENTS = [
  { top: "bg-[#E91E63]",   icon: "grad-primary" },
  { top: "bg-amber-400",   icon: "bg-linear-to-br from-orange-400 to-amber-400" },
  { top: "bg-emerald-500", icon: "bg-linear-to-br from-emerald-400 to-teal-500" },
  { top: "bg-violet-500",  icon: "bg-linear-to-br from-violet-400 to-purple-500" },
];

export default function Branches() {
  const { locale } = useLocale();
  const t = UI[locale];

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BRANCHES_I18N.map((branch, i) => {
            const a = ACCENTS[i % 4];
            const b = branch[locale];
            return (
              <div key={branch.id} className="card-base overflow-hidden">
                <div className={`h-1 ${a.top}`} />
                <div className="p-6 flex flex-col justify-between h-full">
                  <div className="w-full flex items-center mb-2">
                    <div className={`${a.icon} rounded-xl w-11 h-11 flex items-center justify-center text-white text-lg me-4 shadow-subtle`}>
                      {branch.icon}
                    </div>
                    <h3 className="font-bold text-[#2d1a1a]">{b.name}</h3>
                  </div>
                  <p className="mb-2 text-sm text-[#6b7280] leading-relaxed">{b.address}</p>
                  <a href={CLINIC.whatsappLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-semibold text-[#E91E63] hover:text-[#C2185B] transition-colors">
                    <MapPin size={13} />{t.bookBranch}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative rounded-2xl mt-10 overflow-hidden shadow-subtle">
          {/* Background image */}
          <Image
            src="/contact-us.png"
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
            loading="lazy"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/55" aria-hidden="true" />

          {/* Content */}
          <div className="relative z-10 p-30 text-center">
            <h3 className="text-xl font-black text-white mb-2">{t.contactNow}</h3>
            <p className="text-white/80 text-sm mb-6">{t.contactDesc}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={`tel:${CLINIC.phone}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white border-2 border-white/60 hover:bg-white/15 transition-all duration-200 backdrop-blur-sm">
                <Phone size={16} />{CLINIC.phone}
              </a>
              <a href={CLINIC.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-secondary gap-2">
                <MessageCircle size={16} />{t.whatsapp}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
