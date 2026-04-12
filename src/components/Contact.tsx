"use client";
import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import Image from "next/image";
import { CLINIC } from "@/lib/data";
import { useLocale } from "@/lib/LocaleContext";
import { UI } from "@/lib/i18n";

export default function Contact() {
  const { locale } = useLocale();
  const t = UI[locale];

  const socials = [
    { href: CLINIC.facebook,     label: t.facebook,   bg: "bg-blue-600",   char: "f" },
    { href: CLINIC.youtube,      label: t.youtube,    bg: "bg-red-600",    char: "▶" },
    { href: CLINIC.instagram,    label: t.instagram,  bg: "bg-linear-to-br from-pink-500 to-orange-400", char: "◎" },
    { href: CLINIC.whatsappLink, label: t.whatsapp,   bg: "bg-emerald-500", char: "✉" },
  ];

  return (
    <section id="contact" className="section-padding bg-section-a">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="section-header">
          <span className="badge-primary">{t.contactBadge}</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#2d1a1a] mt-3 mb-2 tracking-tight">
            {t.contactTitle} <span className="text-grad-primary">{t.contactHighlight}</span>
          </h2>
          <div className="divider-primary" />
          <p className="text-[#6b7280] mt-4 text-sm">{t.contactSubDesc}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <a href={CLINIC.whatsappLink} target="_blank" rel="noopener noreferrer" className="card-base flex items-center gap-4 p-5">
              <div className="bg-linear-to-br from-emerald-400 to-teal-500 rounded-xl w-12 h-12 flex items-center justify-center text-white shrink-0 shadow-subtle">
                <MessageCircle size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#9ca3af] mb-0.5">{t.whatsappLabel}</p>
                <p className="text-sm font-bold text-[#2d1a1a]" dir="ltr">{CLINIC.whatsapp}</p>
              </div>
            </a>

            <a href={`tel:${CLINIC.phone}`} className="card-base flex items-center gap-4 p-5">
              <div className="grad-primary rounded-xl w-12 h-12 flex items-center justify-center text-white shrink-0 shadow-subtle">
                <Phone size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#9ca3af] mb-0.5">{t.phoneLabel}</p>
                <p className="text-sm font-bold text-[#2d1a1a]" dir="ltr">{CLINIC.phone}</p>
              </div>
            </a>

            <div className="card-base flex items-center gap-4 p-5">
              <div className="bg-linear-to-br from-violet-400 to-purple-500 rounded-xl w-12 h-12 flex items-center justify-center text-white shrink-0 shadow-subtle">
                <MapPin size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#9ca3af] mb-0.5">{t.addressLabel}</p>
                <p className="text-sm font-bold text-[#2d1a1a]">{t.addressValue}</p>
              </div>
            </div>

            <a href={`mailto:${CLINIC.email}`} className="card-base flex items-center gap-4 p-5">
              <div className="bg-linear-to-br from-blue-400 to-blue-600 rounded-xl w-12 h-12 flex items-center justify-center text-white shrink-0 shadow-subtle">
                <Mail size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#9ca3af] mb-0.5">{t.emailLabel}</p>
                <p className="text-sm font-bold text-[#2d1a1a]">{CLINIC.email}</p>
              </div>
            </a>

            <div className="card-base p-5">
              <p className="text-sm font-bold text-[#6b4c4c] mb-3">{t.followUs}</p>
              <div className="flex gap-3">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    aria-label={s.label}
                    className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center text-white hover:opacity-90 hover:scale-105 transition-all duration-200 text-sm font-bold`}>
                    {s.char}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-[#E91E63]/20 text-center shadow-md">
            {/* Background image */}
            <Image
              src="/reserve-now.webp"
              alt=""
              fill
              className="object-cover"
              aria-hidden="true"
            />
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/55" aria-hidden="true" />

            {/* Content */}
            <div className="relative z-10 p-8">
              {/* Doctor avatar */}
              <div className="w-20 h-20 mx-auto mb-5 rounded-full overflow-hidden ring-4 ring-white/30 shadow-lg">
                <Image
                  src="/pi2.png"
                  alt={t.doctorName}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover bg-white"
                />
              </div>
              <h3 className="text-xl font-black text-white mb-2">{t.bookNow}</h3>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">{t.bookDesc}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={CLINIC.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-primary gap-2">
                  <MessageCircle size={18} />{t.ctaFull}
                </a>
                <a href={`tel:${CLINIC.phone}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white border-2 border-white/60 hover:bg-white/15 transition-all duration-200">
                  <Phone size={18} />{t.callUs}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
