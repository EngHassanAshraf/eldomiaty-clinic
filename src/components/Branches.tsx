import { MapPin, Phone, MessageCircle } from "lucide-react";
import { BRANCHES, CLINIC } from "@/lib/data";

const ACCENTS = [
  { top: "bg-[#e8294a]",    icon: "grad-primary" },
  { top: "bg-amber-400",    icon: "bg-gradient-to-br from-orange-400 to-amber-400" },
  { top: "bg-emerald-500",  icon: "bg-gradient-to-br from-emerald-400 to-teal-500" },
  { top: "bg-violet-500",   icon: "bg-gradient-to-br from-violet-400 to-purple-500" },
];

export default function Branches() {
  return (
    <section id="branches" className="section-padding bg-section-a">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="section-header">
          <span className="badge-primary">فروعنا</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#2d1a1a] mt-3 mb-2 tracking-tight">
            نحن <span className="text-grad-primary">قريبون منك</span>
          </h2>
          <div className="divider-primary" />
          <p className="text-[#6b7280] mt-4 text-sm">4 فروع في أبرز مناطق القاهرة لخدمتك</p>
        </div>

        {/* Branch cards — 1 col mobile, 2 tablet, 4 desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BRANCHES.map((branch, i) => {
            const a = ACCENTS[i % 4];
            return (
              <div key={branch.name} className="card-base overflow-hidden">
                {/* Coloured top accent */}
                <div className={`h-1 ${a.top}`} />

                <div className="p-6">
                  {/* Icon badge */}
                  <div className={`${a.icon} rounded-xl w-11 h-11 flex items-center justify-center text-white text-lg mb-4 shadow-subtle`}>
                    {branch.icon}
                  </div>

                  <h3 className="font-bold text-[#2d1a1a] mb-1">{branch.name}</h3>
                  <p className="text-sm text-[#6b7280] leading-relaxed mb-4">{branch.address}</p>

                  <a
                    href={CLINIC.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-semibold text-[#e8294a] hover:text-[#c0392b] transition-colors"
                  >
                    <MapPin size={13} />
                    احجز في هذا الفرع
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact strip — solid light-pink, no glass */}
        <div className="bg-[#fff0f3] border border-[#fad4db]/60 rounded-2xl mt-10 p-8 text-center">
          <h3 className="text-xl font-black text-[#2d1a1a] mb-2">تواصل معنا الآن</h3>
          <p className="text-[#6b7280] text-sm mb-6">نحن هنا للإجابة على جميع استفساراتك</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={`tel:${CLINIC.phone}`} className="btn-outline gap-2">
              <Phone size={16} />
              {CLINIC.phone}
            </a>
            <a
              href={CLINIC.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary gap-2"
            >
              <MessageCircle size={16} />
              واتساب
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
