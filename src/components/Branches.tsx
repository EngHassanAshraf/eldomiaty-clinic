import { MapPin, Phone, MessageCircle } from "lucide-react";
import { BRANCHES, CLINIC } from "@/lib/data";

const ACCENTS = [
  { icon: "grad-rose",                                          ring: "border-[#fad4db]/70" },
  { icon: "bg-linear-to-br from-orange-400 to-amber-400",    ring: "border-[#fde8c8]/70" },
  { icon: "bg-linear-to-br from-emerald-400 to-teal-400",    ring: "border-[#c8f0e0]/70" },
  { icon: "bg-linear-to-br from-violet-400 to-purple-500",   ring: "border-[#d8c8f8]/70" },
];

export default function Branches() {
  return (
    <section id="branches" className="section-padding bg-section-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="section-header">
          <span className="badge-rose">فروعنا</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#2d1a1a] mt-3 mb-2 tracking-tight">
            نحن <span className="text-grad-rose">قريبون منك</span>
          </h2>
          <div className="divider-rose" />
          <p className="text-[#8a6a6a] mt-4 text-sm">4 فروع في أبرز مناطق القاهرة لخدمتك</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BRANCHES.map((branch, i) => {
            const a = ACCENTS[i % 4];
            return (
              <div key={branch.name} className={`card-base border-2 ${a.ring} group p-6 relative overflow-hidden`}>
                {/* Top accent line */}
                <div aria-hidden={true} className={`absolute top-0 inset-x-0 h-1 ${a.icon} rounded-t-[1.25rem]`} />

                {/* Icon badge */}
                <div className={`${a.icon} rounded-2xl w-12 h-12 flex items-center justify-center text-white text-xl mb-4 shadow-card group-hover:scale-110 transition-transform duration-250`}>
                  {branch.icon}
                </div>

                {/* Branch name and details */}
                <h3 className="font-bold text-[#2d1a1a] mb-1">{branch.name}</h3>
                <p className="text-sm text-[#8a6a6a] leading-relaxed mb-3">{branch.address}</p>
                <a href={CLINIC.whatsappLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#e8294a] hover:text-[#c0392b] transition-colors group/link">
                  <MapPin size={13} className="group-hover/link:animate-pulse" />
                  احجز في هذا الفرع
                </a>
              </div>
            );
          })}
        </div>

        {/* Glass-rose contact strip */}
        <div className="glass-rose rounded-3xl border border-[#fad4db]/60 shadow-card-lg overflow-hidden relative mt-10 p-8">
          {/* Top highlight */}
          <div aria-hidden={true} className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #fad4db, transparent)' }} />
          {/* Decorative orb */}
          <div aria-hidden={true} className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(250,212,219,0.40) 0%, transparent 70%)', filter: 'blur(20px)' }} />

          <div className="relative text-center">
            <h3 className="text-xl font-black text-[#2d1a1a] mb-2">تواصل معنا الآن</h3>
            <p className="text-[#8a6a6a] text-sm mb-6">نحن هنا للإجابة على جميع استفساراتك</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={`tel:${CLINIC.phone}`} className="btn-outline-rose gap-2">
                <Phone size={16} />
                {CLINIC.phone}
              </a>
              <a href={CLINIC.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-rose gap-2">
                <MessageCircle size={16} />
                واتساب
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
