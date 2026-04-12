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
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white border-b border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.07)] py-2"
          : "bg-transparent py-4"
      }`}
    >
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:right-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-[#e8294a] focus:rounded-lg focus:shadow-md focus:font-semibold"
      >
        انتقل إلى المحتوى الرئيسي
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">

        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-11 h-11 rounded-xl overflow-hidden">
            <Image
              src="/new-logo.png"
              alt="شعار عيادة دكتور محمد الدمياطي"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-bold text-[#2d1a1a]">د. محمد الدمياطي</p>
            <p className="text-[11px] text-[#e8294a] font-medium">نساء · توليد · حقن مجهرى</p>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5" aria-label="التنقل الرئيسي">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-2 text-sm font-medium text-[#6b4c4c] hover:text-[#e8294a] hover:bg-[#fff0f3] rounded-lg transition-all duration-200"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
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
            className="btn-primary text-sm px-5 py-2.5"
          >
            احجز موعد
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 rounded-lg text-[#6b4c4c] hover:bg-[#fff0f3] transition-colors"
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu — solid white, no glass */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1 shadow-md">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-[#6b4c4c] hover:text-[#e8294a] hover:bg-[#fff0f3] rounded-lg transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
          <a
            href={CLINIC.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-3 btn-primary text-center text-sm w-full"
          >
            احجز موعدك عبر واتساب
          </a>
        </div>
      )}
    </header>
  );
}
