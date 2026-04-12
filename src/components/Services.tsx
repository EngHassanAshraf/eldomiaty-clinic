"use client";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { SERVICES, CLINIC } from "@/lib/data";

const CATEGORIES = ["الكل","إنجاب","ولادة","حمل","جراحة","علاج","تشخيص","وقاية","تجميل"];

export default function Services() {
  const [active, setActive] = useState("الكل");
  const filtered = active === "الكل" ? SERVICES : SERVICES.filter((s) => s.category === active);

  return (
    <section id="services" className="section-padding bg-section-a">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="section-header">
          <span className="badge-primary">خدماتنا</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#2d1a1a] mt-3 mb-2 tracking-tight">
            خدمات <span className="text-grad-primary">العيادة</span>
          </h2>
          <div className="divider-primary" />
          <p className="text-[#6b7280] max-w-xl mx-auto mt-4 text-sm leading-relaxed">
            نقدم مجموعة شاملة من الخدمات الطبية المتخصصة بأحدث التقنيات
          </p>
        </div>

        {/* Operation room image */}
        <div className="rounded-2xl overflow-hidden mb-10 shadow-subtle border border-gray-100">
          <Image
            src="/operation-room.webp"
            alt="غرفة العمليات في عيادة دكتور محمد الدمياطي"
            width={1200}
            height={400}
            className="w-full h-48 sm:h-64 object-cover"
            loading="lazy"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={
                active === cat
                  ? "grad-primary text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-primary transition-all duration-200"
                  : "bg-white text-[#6b4c4c] border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold hover:border-[#e8294a]/40 hover:text-[#e8294a] hover:bg-[#fff0f3] transition-all duration-200 cursor-pointer"
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((s) => (
            <div
              key={s.title}
              className="card-base p-5 text-center cursor-default min-h-[120px] flex flex-col items-center justify-center gap-2"
            >
              <div className="text-3xl">{s.icon}</div>
              <p className="text-sm font-semibold text-[#6b4c4c] leading-tight">{s.title}</p>
              {s.category && (
                <span className="text-[10px] font-medium text-[#e8294a] bg-[#fff0f3] px-2 py-0.5 rounded-full border border-[#fad4db]/60">
                  {s.category}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Booking CTA */}
        <div className="text-center mt-10">
          <a
            href={CLINIC.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary px-8 py-4 text-base gap-2"
          >
            <MessageCircle size={20} />
            احجز موعدك الآن
          </a>
        </div>

      </div>
    </section>
  );
}
