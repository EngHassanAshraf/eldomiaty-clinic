import { GraduationCap, Award, Globe, Heart, MessageCircle } from "lucide-react";
import { DOCTOR_CREDENTIALS, CLINIC } from "@/lib/data";

const CREDENTIAL_ICONS = [GraduationCap, Award, Globe, Heart];

const SPECIALTIES = [
  { label: "حقن مجهرى",     emoji: "🔬", bg: "bg-rose-50",    border: "border-rose-200/60" },
  { label: "ولادة بدون ألم", emoji: "💝", bg: "bg-amber-50",   border: "border-amber-200/60" },
  { label: "مناظير نسائية", emoji: "🏥", bg: "bg-emerald-50", border: "border-emerald-200/60" },
  { label: "جراحات نسائية", emoji: "⚕️", bg: "bg-violet-50",  border: "border-violet-200/60" },
];

export default function About() {
  return (
    <section id="about" className="section-padding bg-section-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="section-header">
          <span className="badge-primary">عن الدكتور</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#2d1a1a] mt-3 mb-2 tracking-tight">
            د. محمد <span className="text-grad-primary">الدمياطي</span>
          </h2>
          <div className="divider-primary" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Bio column */}
          <div className="space-y-6">
            <p className="text-[#6b7280] leading-[1.85] text-base">
              التحقت بكلية طب القصر العينى جامعة القاهرة.
              اخترت دراسة طب النساء والتوليد لشغفى بممارسته؛ إذ أنها دراسة معجزة
              الحياة، كما أنها دراسة أكثر النفسيات تعقيداً فى العالم وهى نفسية المرأة.
            </p>

            {/* Credentials */}
            <div className="space-y-3">
              {DOCTOR_CREDENTIALS.map((cred, i) => {
                const Icon = CREDENTIAL_ICONS[i % 4];
                return (
                  <div key={cred} className="card-base flex items-center gap-3 p-4">
                    <div className="grad-primary rounded-xl p-2.5 shrink-0">
                      <Icon size={18} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-[#6b4c4c]">{cred}</span>
                  </div>
                );
              })}
            </div>

            {/* Specialty quick-links */}
            <div className="grid grid-cols-2 gap-3">
              {SPECIALTIES.map((spec) => (
                <div
                  key={spec.label}
                  className={`${spec.bg} border ${spec.border} rounded-xl p-4 text-center cursor-default transition-colors duration-200 hover:border-[#e8294a]/40`}
                >
                  <div className="text-2xl mb-1">{spec.emoji}</div>
                  <p className="text-xs font-semibold text-[#6b4c4c]">{spec.label}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href={CLINIC.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary gap-2 w-full justify-center"
            >
              <MessageCircle size={18} />
              احجز موعد
            </a>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden shadow-subtle border border-gray-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55257.89711946519!2d31.3043786653215!3d30.047798911398004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145841f484d9a4fb%3A0xcd42682059ca3b5!2z2K_Zg9iq2YjYsSDZhtiz2KfYoSDZiNiq2YjZhNmK2K8g2YHZiiDYp9mE2YXZh9mG2K_Ys9mK2YYgfEVsZG9taWF0eSBDbGluaWMgRHIgTW9oYW1lZCBFbGRvbWlhdHkgLSDYr1zZhdit2YXYryDYp9mE2K_ZhdmK2KfYt9mJ!5e0!3m2!1sar!2seg!4v1559217739546!5m2!1sar!2seg"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="موقع عيادة دكتور محمد الدمياطي"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
