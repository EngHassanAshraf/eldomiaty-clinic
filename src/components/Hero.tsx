"use client";
import { MessageCircle, Phone, ChevronDown, Heart, Shield, Star } from "lucide-react";
import Image from "next/image";
import { CLINIC } from "@/lib/data";

const TRUST_BADGES = [
  { icon: Shield, label: "خبرة 15+ سنة" },
  { icon: Heart,  label: "5000+ حالة ناجحة" },
  { icon: Star,   label: "عضو الجمعية الملكية البريطانية" },
];

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-hero-premium">

      {/* Orb 1 - top right */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-20 -right-20 w-[560px] h-[560px] rounded-full animate-orb-1" style={{ background: 'radial-gradient(circle, rgba(250,212,219,0.55) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      {/* Orb 2 - bottom left */}
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -left-20 w-[420px] h-[420px] rounded-full animate-orb-2" style={{ background: 'radial-gradient(circle, rgba(252,232,236,0.45) 0%, transparent 70%)', filter: 'blur(50px)' }} />
      {/* Orb 3 - mid left */}
      <div aria-hidden="true" className="pointer-events-none absolute top-1/2 -left-10 w-[300px] h-[300px] rounded-full animate-orb-3" style={{ background: 'radial-gradient(circle, rgba(242,92,116,0.25) 0%, transparent 70%)', filter: 'blur(35px)' }} />

      {/* Dot grid overlay */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.022]" style={{ backgroundImage: 'radial-gradient(circle, #e8294a 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
      {/* Top highlight line */}
      <div aria-hidden="true" className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #fad4db, transparent)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* ── Text column ── */}
          <div className="space-y-7 order-2 lg:order-1">

            <div className="badge-rose w-fit animate-fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e8294a] animate-pulse-rose" />
              استشارى أمراض النساء والتوليد
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-black text-[#2d1a1a] leading-[1.12] tracking-tight">
                رعاية تبدأ من
                <br />
                <span className="text-grad-rose">القلب</span>
                {" "}إلى{" "}
                <span className="text-grad-rose">الأمومة</span>
              </h1>
              <p className="text-[1.05rem] text-[#8a6a6a] leading-[1.8] max-w-lg">
                عيادة دكتور محمد الدمياطي — خبرة طبية متميزة في أمراض النساء
                والتوليد والحقن المجهرى، بأجواء من الدفء والأمان.
              </p>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2">
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <div key={label}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 border border-[#fad4db]/70 rounded-full text-xs font-semibold text-[#6b4c4c] shadow-soft transition-all duration-200 hover:border-[#e8294a]/40 hover:shadow-rose">
                  <Icon size={13} className="text-[#e8294a]" />
                  {label}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <a href={CLINIC.whatsappLink} target="_blank" rel="noopener noreferrer"
                className="btn-rose gap-2 text-base">
                <MessageCircle size={18} />
                احجز موعدك الآن
              </a>
              <a href={`tel:${CLINIC.phone}`} className="btn-outline-rose gap-2 text-base">
                <Phone size={18} />
                اتصل بنا
              </a>
            </div>

            {/* Mini stats */}
            <div className="flex flex-wrap gap-8 pt-5 border-t border-[#fad4db]/50">
              {[
                { n: "15+",   l: "سنة خبرة" },
                { n: "4",     l: "فروع" },
                { n: "5000+", l: "حالة ناجحة" },
                { n: "100%",  l: "رضا المرضى" },
              ].map((s) => (
                <div key={s.l} className="group cursor-default">
                  <p className="text-2xl font-black text-grad-rose group-hover:scale-110 transition-transform duration-200 inline-block">{s.n}</p>
                  <p className="text-xs text-[#8a6a6a] mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Card column ── */}
          <div className="relative flex justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-sm">

              {/* Badge 1 - top left */}
              <div className="absolute -top-4 -left-4 z-20 glass-rose rounded-2xl px-3 py-2 shadow-card animate-float-delayed flex items-center gap-2 text-xs font-semibold text-[#e8294a]">
                <span>✓</span><span>رد فورى</span>
              </div>
              {/* Badge 2 - bottom right */}
              <div className="absolute -bottom-4 -right-4 z-20 glass-rose rounded-2xl px-3 py-2 shadow-card animate-float-slow flex items-center gap-2 text-xs font-semibold text-[#e8294a]">
                <span>📍</span><span>4 مناطق</span>
              </div>

              {/* Halo ring 1 */}
              <div aria-hidden="true" className="absolute inset-0 rounded-4xl border border-[#fad4db]/30 scale-[1.07] -z-10" />
              {/* Halo ring 2 */}
              <div aria-hidden="true" className="absolute inset-0 rounded-4xl border border-[#fad4db]/15 scale-[1.14] -z-10" />

              {/* Main card — premium glass */}
              <div className="relative glass glass-highlight glow-rose shadow-rose-xl rounded-4xl border border-white/75 p-7 overflow-hidden">
                {/* Inner top highlight */}
                <div aria-hidden="true" className="absolute top-0 inset-x-0 h-px rounded-t-4xl" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.80), transparent)' }} />
                {/* Subtle inner glow */}
                <div aria-hidden="true" className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(249,168,180,0.18) 0%, transparent 70%)" }} />

                {/* Logo */}
                <div className="flex justify-center mb-5">
                  <div className="relative w-28 h-28 rounded-3xl overflow-hidden shadow-rose bg-white p-2 animate-float">
                    <Image src="/logo.png" alt="شعار العيادة" fill className="object-contain" />
                  </div>
                </div>

                <div className="text-center space-y-1 mb-6">
                  <p className="text-xl font-black text-[#2d1a1a] tracking-tight">د. محمد الدمياطي</p>
                  <p className="text-sm text-[#8a6a6a]">استشارى نساء وتوليد وحقن مجهرى</p>
                  <div className="flex justify-center gap-0.5 pt-1">
                    {[1,2,3,4,5].map((i) => (
                      <span key={i} className="text-[#e8294a] text-base drop-shadow-sm">★</span>
                    ))}
                  </div>
                </div>

                {/* Credentials */}
                <div className="space-y-2">
                  {[
                    "جامعة القاهرة — القصر العينى",
                    "عضو الجمعية الملكية البريطانية",
                    "عضو الجمعية الأمريكية للإنجاب",
                  ].map((c) => (
                    <div key={c}
                      className="flex items-center gap-2 px-3 py-2.5 bg-linear-to-r from-[#fff0f3] to-[#fff8f9] rounded-xl border border-[#fad4db]/40 transition-colors hover:border-[#e8294a]/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e8294a] shrink-0" />
                      <span className="text-xs text-[#6b4c4c] font-medium">{c}</span>
                    </div>
                  ))}
                </div>

                <a href={CLINIC.whatsappLink} target="_blank" rel="noopener noreferrer"
                  className="btn-rose gap-2 mt-5 text-sm w-full">
                  <MessageCircle size={16} />
                  احجز الآن
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#c4a0a0] animate-bounce">
          <span className="text-[11px] font-medium">اكتشف المزيد</span>
          <ChevronDown size={16} />
        </div>
      </div>
    </section>
  );
}
