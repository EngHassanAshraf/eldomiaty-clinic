"use client";
import { GraduationCap, Award, Globe, Heart, MessageCircle } from "lucide-react";
import { CLINIC } from "@/lib/data";
import { useLocale } from "@/lib/LocaleContext";
import { UI, DOCTOR_CREDENTIALS_I18N } from "@/lib/i18n";

const CREDENTIAL_ICONS = [GraduationCap, Award, Globe, Heart];

export default function About() {
  const { locale } = useLocale();
  const t = UI[locale];

  const specialties = [
    { label: t.spec1, emoji: "🔬", bg: "bg-rose-50",    border: "border-rose-200/60" },
    { label: t.spec2, emoji: "💝", bg: "bg-amber-50",   border: "border-amber-200/60" },
    { label: t.spec3, emoji: "🏥", bg: "bg-emerald-50", border: "border-emerald-200/60" },
    { label: t.spec4, emoji: "⚕️", bg: "bg-violet-50",  border: "border-violet-200/60" },
  ];

  return (
    <section id="about" className="section-padding bg-section-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="section-header">
          <span className="badge-secondary">{t.aboutBadge}</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#2d1a1a] mt-3 mb-2 tracking-tight">
            {locale === "ar" ? <>د. محمد <span className="text-grad-secondary">الدمياطي</span></> : <>Dr. <span className="text-grad-secondary">Eldomiaty</span></>}
          </h2>
          <div className="divider-primary" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <p className="text-[#6b7280] leading-[1.85] text-base">{t.aboutBio}</p>

            <div className="space-y-3">
              {DOCTOR_CREDENTIALS_I18N.map((cred, i) => {
                const Icon = CREDENTIAL_ICONS[i % 4];
                return (
                  <div key={cred.en} className="card-base flex items-center gap-3 p-4">
                    <div className="grad-primary rounded-xl p-2.5 shrink-0">
                      <Icon size={18} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-[#6b4c4c]">{cred[locale]}</span>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {specialties.map((spec) => (
                <div key={spec.label} className={`${spec.bg} border ${spec.border} rounded-xl p-4 text-center cursor-default transition-colors duration-200 hover:border-[#E91E63]/40`}>
                  <div className="text-2xl mb-1">{spec.emoji}</div>
                  <p className="text-xs font-semibold text-[#6b4c4c]">{spec.label}</p>
                </div>
              ))}
            </div>

            <a href={CLINIC.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-secondary gap-2 w-full justify-center">
              <MessageCircle size={18} />{t.cta}
            </a>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-subtle border border-gray-100">
            <iframe
              src={locale ==="en"? CLINIC.mapEnEmbed: CLINIC.mapArEmbed}
              width="100%" height="450"
              style={{ border: 0 }} allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="الخريطة"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
