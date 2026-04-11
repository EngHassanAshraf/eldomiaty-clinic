"use client";
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import Image from "next/image";
import { CLINIC } from "@/lib/data";

const NAV_LINKS = [
  { href: "#home",         label: "الرئيسية" },
  { href: "#about",        label: "عن الدكتور" },
  { href: "#services",     label: "الخدمات" },
  { href: "#branches",     label: "الفروع" },
  { href: "#testimonials", label: "آراء المرضى" },
  { href: "#contact",      label: "اتصل بنا" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass shadow-soft py-2 border-b border-rose-100/60"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">

        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-11 h-11 rounded-2xl overflow-hidden shadow-rose group-hover:scale-105 transition-transform">
            <Image src="/logo.png" alt="شعار عيادة دكتور محمد الدمياطي" fill className="object-contain p-1" />
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-bold text-[#2d1a1a]">د. محمد الدمياطي</p>
            <p className="text-[11px] text-[#e8294a] font-medium">نساء · توليد · حقن مجهرى</p>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-2 text-sm font-medium text-[#6b4c4c] hover:text-[#e8294a] hover:bg-[#fff0f3] rounded-xl transition-all duration-200"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <a
            href={`tel:${CLINIC.phone}`}
            className="flex items-center gap-1.5 text-sm font-medium text-[#6b4c4c] hover:text-[#e8294a] transition-colors"
          >
            <Phone size={15} className="text-[#e8294a]" />
            <span dir="ltr" className="text-xs">{CLINIC.phone}</span>
          </a>
          <a
            href={CLINIC.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-rose text-sm px-5 py-2.5"
          >
            حجز موعد
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 rounded-xl text-[#6b4c4c] hover:bg-[#fff0f3] transition-colors"
          aria-label="القائمة"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden glass border-t border-rose-100/50 px-4 py-4 space-y-1">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-[#6b4c4c] hover:text-[#e8294a] hover:bg-[#fff0f3] rounded-xl transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
          <a
            href={CLINIC.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 btn-rose text-center text-sm"
          >
            احجز موعدك عبر واتساب
          </a>
        </div>
      )}
    </header>
  );
}
