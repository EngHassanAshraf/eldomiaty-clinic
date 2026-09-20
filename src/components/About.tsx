"use client";
import dynamic from "next/dynamic";
import { GraduationCap, Award, Globe, Heart, MessageCircle } from "lucide-react";
import { CLINIC } from "@/lib/data";
import { useLocale } from "@/lib/LocaleContext";
import { UI, DOCTOR_CREDENTIALS_I18N, resources } from "@/lib/i18n";
import ImageGallery from '@/components/ImageGallery';

const CREDENTIAL_ICONS = [GraduationCap, Award, Globe, Heart];

const SERVICE_KEYS = ["endoscopy", "icsi", "oncology", "highRiskPregnancy"] as const;

const SERVICE_STYLES = [
  { emoji: "🔬", bg: "bg-rose-50", border: "border-rose-200/60" },
  { emoji: "💝", bg: "bg-amber-50", border: "border-amber-200/60" },
  { emoji: "🏥", bg: "bg-emerald-50", border: "border-emerald-200/60" },
  { emoji: "⚕️", bg: "bg-violet-50", border: "border-violet-200/60" },
] as const;

const ClinicMap = dynamic(() => import("@/components/ClinicMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] w-full animate-pulse bg-[#faf7f5]" aria-label="Loading map" />
  ),
});

export default function About() {
  const { locale } = useLocale();
  const t = UI[locale];
  const copy = resources[locale];

  const serviceCards = SERVICE_KEYS.map((key, i) => ({
    key,
    ...copy.services[key],
    ...SERVICE_STYLES[i],
  }));

  return (
    <section id="about" className="section-padding bg-section-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="section-header">
          <span className="badge-secondary">{t.aboutBadge}</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#2d1a1a] mt-3 mb-2 tracking-tight">
            {locale === "ar" ? (
              <>
                <span className="text-grad-secondary"> د. محمد </span><span className="text-grad-primary">الدمياطي</span>
              </>
            ) : (
              <>
                <span className="text-grad-secondary">Dr.</span> <span className="text-grad-primary">Eldomiaty</span>
              </>
            )}
          </h2>
          <div className="divider-primary" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-grad-secondary font-medium leading-[1.85] text-base">

                {copy.about.bio_0}
                <span className="text-grad-primary"> {copy.about.bio_1} </span>
                {copy.about.bio_2}
                <span className="text-grad-primary"> {copy.about.bio_3} </span>
                {copy.about.bio_4}

              </p>
              <p className="text-grad-secondary font-medium leading-[1.85] text-base">{copy.about.intro}</p>
            </div>

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
          </div>

          <div className="rounded-2xl  h-full">
            <ImageGallery />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {serviceCards.map((service) => (
            <div
              key={service.key}
              className={`${service.bg} border ${service.border} rounded-xl p-4 text-start cursor-default transition-colors duration-200 hover:border-[#E91E63]/40 h-full`}
            >
              <p className="text-sm mb-2 font-semibold text-[#2d1a1a] flex items-center gap-2">
                <span className="text-xl">{service.emoji}</span>
                <span className="text-grad-primary">{service.title}</span>
              </p>

              <p className="text-xs text-grad-secondary leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-6">
          <div className="card-base p-5 space-y-2">
            <h3 className="text-base font-black text-[#2d1a1a]">
              <span className="text-xl">🩺</span>
              <span className="text-grad-primary">{copy.vision.title}</span>
            </h3>
            <p className="text-sm text-grad-secondary leading-relaxed">{copy.vision.description}</p>
          </div>

          <a
            href={CLINIC.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary gap-2 w-full sm:w-auto justify-center"
          >
            <MessageCircle size={18} />
            {t.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
