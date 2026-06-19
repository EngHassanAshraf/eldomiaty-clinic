"use client";
import { MessageCircle, Phone, Shield, Award, Star } from "lucide-react";
import Image from "next/image";
import { CLINIC } from "@/lib/data";
import { useLocale } from "@/lib/LocaleContext";
import { UI } from "@/lib/i18n";

export default function Hero() {
  const { locale } = useLocale();
  const t = UI[locale];
  const isRTL = locale === "ar";

  const trustBadges = [
    { icon: Shield, label: t.trust1 },
    { icon: Award,  label: t.trust2 },
    { icon: Star,   label: t.trust3 },
  ];

  const miniStats = [
    { n: "15+",    l: isRTL ? "سنة خبرة"   : "Years Exp."  },
    { n: "4",      l: isRTL ? "فروع"       : "Branches"    },
    { n: "20000+", l: isRTL ? "حالة ناجحة" : "Cases"       },
    { n: "100%",   l: isRTL ? "رضا المرضى" : "Satisfaction" },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-hero">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-35 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Text column */}
          <div className="space-y-7 order-2 lg:order-1">
            <div className="badge-primary w-fit animate-fade-up">{t.specialty}</div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.2rem] font-black text-[#2d1a1a] leading-[1.15] tracking-tight">
                {isRTL ? (
                  <>
                    رعاية تبدأ من<br />
                    <span className="text-grad-primary">القلب</span>{" "}إلى{" "}
                    <span className="text-grad-primary">الأمومة</span>
                  </>
                ) : (
                  <>
                    Care That Starts<br />
                    <span className="text-grad-primary">From the Heart</span>
                    <br />
                    <span className="text-grad-primary">to Motherhood</span>
                  </>
                )}
              </h1>
              <p className="text-base text-[#6b7280] leading-[1.8] max-w-lg">{t.heroDesc}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {trustBadges.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-[#6b4c4c] shadow-subtle">
                  <Icon size={13} className="text-[#E91E63]" />
                  {label}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <a href={CLINIC.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-primary gap-2 text-base">
                <MessageCircle size={18} />{t.ctaFull}
              </a>
              <a href={`tel:${CLINIC.phone}`} className="btn-outline gap-2 text-base">
                <Phone size={18} />{t.callUs}
              </a>
            </div>

            <div className="flex flex-wrap gap-8 pt-5 border-t border-gray-100">
              {miniStats.map((s) => (
                <div key={s.l} className="cursor-default">
                  <p className="text-2xl font-black text-grad-primary">{s.n}</p>
                  <p className="text-xs text-[#9ca3af] mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor image column */}
          <div className="relative flex justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-sm">
              <div className="relative rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-[#FCE4EC]">
                <Image
                  src="/doctor-img.jpg"
                  alt={`${t.doctorName} — ${t.specialty}`}
                  width={480} height={560} priority
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    const el = e.currentTarget as HTMLImageElement;
                    el.style.display = "none";
                    const p = el.parentElement;
                    if (p) { p.style.background = "linear-gradient(135deg,#E91E63,#F06292)"; p.style.minHeight = "400px"; }
                  }}
                />
                <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm px-5 py-4 border-t border-gray-100">
                  <p className="font-black text-[#2d1a1a] text-base">{t.doctorName}</p>
                  <p className="text-xs text-[#6b7280] mt-0.5">{t.doctorSub}</p>
                  <div className="flex gap-0.5 mt-1.5">
                    {[1,2,3,4,5].map((i) => <span key={i} className="text-[#E91E63] text-sm">★</span>)}
                  </div>
                </div>
              </div>

              <div className="absolute -top-3 -right-3 z-10 bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-subtle flex items-center gap-2 text-xs font-semibold text-[#2d1a1a]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-ring" />
                {t.available}
              </div>
              <div className="absolute -bottom-3 -left-3 z-10 bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-subtle flex items-center gap-2 text-xs font-semibold text-[#2d1a1a]">
                <span>📍</span><span>{t.branches4}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
