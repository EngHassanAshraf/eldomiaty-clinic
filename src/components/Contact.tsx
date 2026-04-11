import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import { CLINIC } from "@/lib/data";

export default function Contact() {
  return (
    <section id="contact" className="bg-section-a section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="section-header">
          <span className="badge-rose">تواصل معنا</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#2d1a1a] mt-3 mb-2 tracking-tight">
            نحن هنا <span className="text-grad-rose">من أجلك</span>
          </h2>
          <div className="divider-rose" />
          <p className="text-[#8a6a6a] mt-4 text-sm">تواصل معنا عبر أى وسيلة تناسبك لحجز موعدك</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* Contact method cards — Task 10.1 */}
          <div className="space-y-4">

            {/* WhatsApp */}
            <a href={CLINIC.whatsappLink} target="_blank" rel="noopener noreferrer"
              className="card-base flex items-center gap-4 p-5 group">
              <div className="bg-linear-to-br from-emerald-400 to-teal-500 rounded-2xl w-12 h-12 flex items-center justify-center text-white shrink-0 shadow-card group-hover:scale-110 transition-transform duration-250">
                <MessageCircle size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#8a6a6a] mb-0.5">واتساب</p>
                <p className="text-sm font-bold text-[#2d1a1a]" dir="ltr">{CLINIC.whatsapp}</p>
              </div>
            </a>

            {/* Phone */}
            <a href={`tel:${CLINIC.phone}`}
              className="card-base flex items-center gap-4 p-5 group">
              <div className="grad-rose rounded-2xl w-12 h-12 flex items-center justify-center text-white shrink-0 shadow-card group-hover:scale-110 transition-transform duration-250">
                <Phone size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#8a6a6a] mb-0.5">هاتف</p>
                <p className="text-sm font-bold text-[#2d1a1a]" dir="ltr">{CLINIC.phone}</p>
              </div>
            </a>

            {/* Address / Location */}
            <div className="card-base flex items-center gap-4 p-5 group">
              <div className="bg-linear-to-br from-violet-400 to-purple-500 rounded-2xl w-12 h-12 flex items-center justify-center text-white shrink-0 shadow-card group-hover:scale-110 transition-transform duration-250">
                <MapPin size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#8a6a6a] mb-0.5">العنوان</p>
                <p className="text-sm font-bold text-[#2d1a1a]">فروع متعددة — القاهرة</p>
              </div>
            </div>

            {/* Email */}
            <a href={`mailto:${CLINIC.email}`}
              className="card-base flex items-center gap-4 p-5 group">
              <div className="bg-linear-to-br from-violet-400 to-purple-500 rounded-2xl w-12 h-12 flex items-center justify-center text-white shrink-0 shadow-card group-hover:scale-110 transition-transform duration-250">
                <Mail size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#8a6a6a] mb-0.5">بريد إلكتروني</p>
                <p className="text-sm font-bold text-[#2d1a1a]">{CLINIC.email}</p>
              </div>
            </a>

            {/* Social */}
            <div className="card-base p-5">
              <p className="text-sm font-bold text-[#6b4c4c] mb-3">تابعنا على</p>
              <div className="flex gap-3">
                {[
                  { href: CLINIC.facebook,     label: "فيسبوك",   bg: "bg-blue-600",   char: "f" },
                  { href: CLINIC.youtube,      label: "يوتيوب",   bg: "bg-red-600",    char: "▶" },
                  { href: CLINIC.instagram,    label: "إنستجرام", bg: "bg-linear-to-br from-pink-500 to-orange-400", char: "◎" },
                  { href: CLINIC.whatsappLink, label: "واتساب",   bg: "bg-emerald-500", char: "✉" },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    aria-label={s.label}
                    className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center text-white hover:scale-110 hover:shadow-soft transition-all duration-200 text-sm font-bold`}>
                    {s.char}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Booking CTA panel — Task 10.2 */}
          <div className="glass-rose rounded-3xl border border-[#fad4db]/60 shadow-rose-lg overflow-hidden relative p-8 text-center">
            {/* Top highlight */}
            <div aria-hidden={true} className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #fad4db, transparent)' }} />
            {/* Decorative orb */}
            <div aria-hidden={true} className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(250,212,219,0.40) 0%, transparent 70%)', filter: 'blur(15px)' }} />

            {/* Floating logo card */}
            <div className="w-16 h-16 mx-auto mb-5 grad-rose rounded-2xl flex items-center justify-center shadow-rose animate-float">
              <span className="text-white text-2xl font-black">د</span>
            </div>

            <h3 className="text-xl font-black text-[#2d1a1a] mb-2">احجز موعدك الآن</h3>
            <p className="text-[#8a6a6a] text-sm mb-6 leading-relaxed">تواصل معنا عبر واتساب أو اتصل بنا مباشرة</p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={CLINIC.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-rose gap-2">
                <MessageCircle size={18} />
                واتساب
              </a>
              <a href={`tel:${CLINIC.phone}`} className="btn-outline-rose gap-2">
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
