"use client";
import { MessageCircle, Phone, Shield, Award, Star } from "lucide-react";
import Image from "next/image";
import { CLINIC } from "@/lib/data";

const TRUST_BADGES = [
  { icon: Shield, label: "خبرة 15+ سنة" },
  { icon: Award,  label: "5000+ حالة ناجحة" },
  { icon: Star,   label: "عضو الجمعية الملكية البريطانية" },
];

const MINI_STATS = [
  { n: "15+",   l: "سنة خبرة" },
  { n: "4",     l: "فروع" },
  { n: "5000+", l: "حالة ناجحة" },
  { n: "100%",  l: "رضا المرضى" },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-hero"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ── Text column ── */}
          <div className="space-y-7 order-2 lg:order-1">

            {/* Specialty badge */}
            <div className="badge-primary w-fit animate-fade-up">
              استشارى أمراض النساء والتوليد
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.2rem] font-black text-[#2d1a1a] leading-[1.15] tracking-tight">
                رعاية تبدأ من
                <br />
                <span className="text-grad-primary">القلب</span>
                {" "}إلى{" "}
                <span className="text-grad-primary">الأمومة</span>
              </h1>
              <p className="text-base text-[#6b7280] leading-[1.8] max-w-lg">
                عيادة دكتور محمد الدمياطي — خبرة طبية متميزة في أمراض النساء
                والتوليد والحقن المجهرى، بأجواء من الدفء والأمان.
              </p>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2">
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-[#6b4c4c] shadow-subtle"
                >
                  <Icon size={13} className="text-[#e8294a]" />
                  {label}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <a
                href={CLINIC.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary gap-2 text-base"
              >
                <MessageCircle size={18} />
                احجز موعدك الآن
              </a>
              <a href={`tel:${CLINIC.phone}`} className="btn-outline gap-2 text-base">
                <Phone size={18} />
                اتصل بنا
              </a>
            </div>

            {/* Mini stats */}
            <div className="flex flex-wrap gap-8 pt-5 border-t border-gray-100">
              {MINI_STATS.map((s) => (
                <div key={s.l} className="cursor-default">
                  <p className="text-2xl font-black text-grad-primary">{s.n}</p>
                  <p className="text-xs text-[#9ca3af] mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Doctor image column ── */}
          <div className="relative flex justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-sm">

              {/* Portrait frame */}
              <div className="relative rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-[#fef0f3]">
                <Image
                  src="/doctor-img.jpg"
                  alt="دكتور محمد الدمياطي — استشارى أمراض النساء والتوليد"
                  width={480}
                  height={560}
                  priority
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.style.background = "linear-gradient(135deg, #e8294a 0%, #f25c74 100%)";
                      parent.style.minHeight = "400px";
                    }
                  }}
                />

                {/* Name overlay at bottom */}
                <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm px-5 py-4 border-t border-gray-100">
                  <p className="font-black text-[#2d1a1a] text-base">د. محمد الدمياطي</p>
                  <p className="text-xs text-[#6b7280] mt-0.5">استشارى نساء وتوليد وحقن مجهرى</p>
                  <div className="flex gap-0.5 mt-1.5">
                    {[1,2,3,4,5].map((i) => (
                      <span key={i} className="text-[#e8294a] text-sm">★</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badge — top left */}
              <div className="absolute -top-3 -right-3 z-10 bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-subtle flex items-center gap-2 text-xs font-semibold text-[#2d1a1a]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-ring" />
                متاح للحجز
              </div>

              {/* Floating badge — bottom left */}
              <div className="absolute -bottom-3 -left-3 z-10 bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-subtle flex items-center gap-2 text-xs font-semibold text-[#2d1a1a]">
                <span>📍</span>
                <span>4 فروع بالقاهرة</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
