"use client";
import Image from "next/image";
import { Heart } from "lucide-react";
import { CLINIC } from "@/lib/data";
import { useLocale } from "@/lib/LocaleContext";
import { UI, BRANCHES_I18N } from "@/lib/i18n";

export default function Footer() {
  const { locale } = useLocale();
  const t = UI[locale];

  const quickLinks = [
    { href: "#about",        label: t.aboutBadge },
    { href: "#services",     label: t.servicesBadge },
    { href: "#testimonials", label: t.testimonialsBadge },
    { href: "#contact",      label: t.contactBadge },
  ];

  const socials = [
    { href: CLINIC.facebook,     label: t.facebook,   char: "f" },
    { href: CLINIC.youtube,      label: t.youtube,    char: "▶" },
    { href: CLINIC.instagram,    label: t.instagram,  char: "◎" },
    { href: CLINIC.whatsappLink, label: t.whatsapp,   char: "✉" },
  ];

  return (
    <footer className="bg-[#2d1a1a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white p-1">
                <Image src="/new-logo.png" alt={`شعار ${CLINIC.name}`} fill className="object-contain" />
              </div>
              <div>
                <p className="font-black text-white">{locale === "ar" ? "د. محمد الدمياطي" : "Dr. Mohamed Eldomiaty"}</p>
                <p className="text-xs text-[#c4a0a0]">{t.footerSub}</p>
              </div>
            </div>
            <p className="text-[#c4a0a0] text-sm leading-relaxed max-w-sm">{t.footerDesc}</p>
            <div className="flex gap-2">
              {socials.map((s) => (
                <a key={s.char} href={s.href} target="_blank" rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#E91E63] flex items-center justify-center text-[#c4a0a0] hover:text-white text-xs font-bold transition-all duration-200">
                  {s.char}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-black text-white mb-4 text-sm">{t.ourBranches}</h4>
            <ul className="space-y-2">
              {BRANCHES_I18N.map((b) => (
                <li key={b.id}>
                  <a href="#branches" className="text-[#c4a0a0] hover:text-[#F06292] text-sm transition-colors duration-200">
                    {b[locale].name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black text-white mb-4 text-sm">{t.quickLinks}</h4>
            <ul className="space-y-2">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-[#c4a0a0] hover:text-[#F06292] text-sm transition-colors duration-200">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8a6a6a]">
          <p>© {new Date().getFullYear()} {CLINIC.name}. {t.copyright}</p>
          <p className="flex items-center gap-1">
            {t.madeWith} <Heart size={12} className="text-[#E91E63] fill-[#E91E63]" /> {t.madeFor}
          </p>
        </div>
      </div>
    </footer>
  );
}
