import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import { CLINIC } from "@/lib/data";

export default function Contact() {
  return (
    <section id="contact" className="section-padding bg-section-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="section-header">
          <span className="badge-primary">تواصل معنا</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#2d1a1a] mt-3 mb-2 tracking-tight">
            نحن هنا <span className="text-grad-primary">من أجلك</span>
          </h2>
          <div className="divider-primary" />
          <p className="text-[#6b7280] mt-4 text-sm">تواصل معنا عبر أى وسيلة تناسبك لحجز موعدك</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* Contact method cards */}
          <div className="space-y-4">

            <a
              href={CLINIC.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="card-base flex items-center gap-4 p-5"
            >
              <div className="bg-linear-to-br from-emerald-400 to-teal-500 rounded-xl w-12 h-12 flex items-center justify-center text-white shrink-0 shadow-subtle">
                <MessageCircle size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#9ca3af] mb-0.5">واتساب</p>
                <p className="text-sm font-bold text-[#2d1a1a]" dir="ltr">{CLINIC.whatsapp}</p>
              </div>
            </a>

            <a
              href={`tel:${CLINIC.phone}`}
              className="card-base flex items-center gap-4 p-5"
            >
              <div className="grad-primary rounded-xl w-12 h-12 flex items-center justify-center text-white shrink-0 shadow-subtle">
                <Phone size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#9ca3af] mb-0.5">هاتف</p>
                <p className="text-sm font-bold text-[#2d1a1a]" dir="ltr">{CLINIC.phone}</p>
              </div>
            </a>

            <div className="card-base flex items-center gap-4 p-5">
              <div className="bg-linear-to-br from-violet-400 to-purple-500 rounded-xl w-12 h-12 flex items-center justify-center text-white shrink-0 shadow-subtle">
                <MapPin size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#9ca3af] mb-0.5">العنوان</p>
                <p className="text-sm font-bold text-[#2d1a1a]">فروع متعددة — القاهرة</p>
              </div>
            </div>

            <a
              href={`mailto:${CLINIC.email}`}
              className="card-base flex items-center gap-4 p-5"
            >
              <div className="bg-linear-to-br from-blue-400 to-blue-600 rounded-xl w-12 h-12 flex items-center justify-center text-white shrink-0 shadow-subtle">
                <Mail size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#9ca3af] mb-0.5">بريد إلكتروني</p>
                <p className="text-sm font-bold text-[#2d1a1a]">{CLINIC.email}</p>
              </div>
            </a>

            {/* Social links */}
            <div className="card-base p-5">
              <p className="text-sm font-bold text-[#6b4c4c] mb-3">تابعنا على</p>
              <div className="flex gap-3">
                {[
                  { href: CLINIC.facebook,     label: "فيسبوك",   bg: "bg-blue-600",   char: "f" },
                  { href: CLINIC.youtube,      label: "يوتيوب",   bg: "bg-red-600",    char: "▶" },
                  { href: CLINIC.instagram,    label: "إنستجرام", bg: "bg-gradient-to-br from-pink-500 to-orange-400", char: "◎" },
                  { href: CLINIC.whatsappLink, label: "واتساب",   bg: "bg-emerald-500", char: "✉" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center text-white hover:opacity-90 hover:scale-105 transition-all duration-200 text-sm font-bold`}
                  >
                    {s.char}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Booking CTA panel — solid light-pink, no glass */}
          <div className="bg-[#fff0f3] border border-[#fad4db]/60 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-5 grad-primary rounded-2xl flex items-center justify-center shadow-primary">
              <span className="text-white text-2xl font-black">د</span>
            </div>

            <h3 className="text-xl font-black text-[#2d1a1a] mb-2">احجز موعدك الآن</h3>
            <p className="text-[#6b7280] text-sm mb-6 leading-relaxed">
              تواصل معنا عبر واتساب أو اتصل بنا مباشرة
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={CLINIC.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary gap-2"
              >
                <MessageCircle size={18} />
                احجز موعدك الآن
              </a>
              <a href={`tel:${CLINIC.phone}`} className="btn-outline gap-2">
                <Phone size={18} />
                اتصل بنا
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
