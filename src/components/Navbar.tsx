"use client";
import { useState, useEffect } from "react";
import { Menu, X, Globe } from "lucide-react";
import Image from "next/image";
import { CLINIC } from "@/lib/data";
import { useLocale } from "@/lib/LocaleContext";
import { UI } from "@/lib/i18n";
import { useAuth } from "@/contexts/auth-context";

type NavLink = { href: string; ar: string; en: string };

const BASE_NAV_LINKS: NavLink[] = [
  { href: "#home",     ar: "الرئيسية",   en: "Home" },
  { href: "#about",    ar: "عن الدكتور", en: "About" },
  { href: "#services", ar: "الخدمات",    en: "Services" },
  { href: "#branches", ar: "فروعنا",     en: "Branches" },
  { href: "#contact",  ar: "اتصل بنا",   en: "Contact" },
];

const GUEST_LINKS: NavLink[] = [
  { href: "/login",    ar: "تسجيل دخول", en: "Login" },
  { href: "/register", ar: "إنشاء حساب", en: "Register" },
];

const AUTH_LINKS: NavLink[] = [
  { href: "/files",              ar: "الملفات",      en: "Files" },
  { href: "/payment/request",    ar: "طلب اشتراك",   en: "Payment Request" },
  { href: "/payment/my-requests", ar: "طلباتي",      en: "My Requests" },
];

const ADMIN_LINK: NavLink = {
  href: "/dashboard",
  ar: "لوحة التحكم",
  en: "Dashboard",
};

export default function Navbar() {
  const { locale, setLocale } = useLocale();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isRTL = locale === "ar";
  const t     = UI[locale];

  const authLinks: NavLink[] = isLoading
    ? []
    : isAuthenticated
      ? user?.role === "ADMIN"
        ? [...AUTH_LINKS, ADMIN_LINK]
        : AUTH_LINKS
      : GUEST_LINKS;

  const navLinks = [...BASE_NAV_LINKS, ...authLinks];

  const toggleLocale = () => setLocale(locale === "ar" ? "en" : "ar");
  const closeMenu    = () => setOpen(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    closeMenu();
    try {
      await logout();
    } finally {
      setLoggingOut(false);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setOpen(false); };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header role="banner" dir={isRTL ? "rtl" : "ltr"} className="fixed top-0 inset-x-0 z-50 px-4 pt-3 pb-1">

      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:inset-s-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-[#E91E63] focus:rounded-xl focus:shadow-md focus:font-semibold focus:text-sm"
      >
        {t.skip}
      </a>

      {/* Floating pill */}
      <div
        className={`max-w-6xl mx-auto rounded-full border transition-all duration-300 backdrop-blur-md ${
          scrolled
            ? "bg-white/95 border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
            : "bg-white/80 border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
        }`}
        style={{ WebkitBackdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5">

          {/* Brand */}
          <a href="#home" className="flex items-center gap-2.5 shrink-0 group" aria-label={CLINIC.name}>
            <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-[#E91E63]/20 group-hover:ring-[#E91E63]/50 transition-all duration-200">
              <Image src="/new-logo.png" alt={`شعار ${CLINIC.name}`} fill className="object-contain" priority />
            </div>
            <div className="sm:block leading-tight">
              <p className="text-sm font-bold text-gray-800 group-hover:text-[#E91E63] transition-colors duration-200">
                {isRTL ? "د. محمد الدمياطي" : "Dr. Eldomiaty"}
              </p>
              <p className="text-[10px] font-medium" style={{ color: "#3A8DDE" }}>
                {t.footerSub}
              </p>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label={t.nav}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-sm font-medium text-gray-600 rounded-full hover:text-[#E91E63] hover:bg-[#E91E63]/8 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#E91E63] focus-visible:outline-offset-2"
              >
                {link[locale]}
              </a>
            ))}
            {isAuthenticated && !isLoading && (
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="px-3.5 py-2 text-sm font-medium text-gray-600 rounded-full hover:text-[#E91E63] hover:bg-[#E91E63]/8 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#E91E63] focus-visible:outline-offset-2 disabled:opacity-60"
              >
                {loggingOut ? (isRTL ? "جارى الخروج..." : "Logging out...") : isRTL ? "تسجيل الخروج" : "Logout"}
              </button>
            )}
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {isAuthenticated && user && !isLoading && (
              <span
                className="hidden xl:block max-w-[140px] truncate text-xs font-medium text-gray-500 px-2"
                dir="ltr"
                title={user.email}
              >
                {user.email}
              </span>
            )}
            <button
              onClick={toggleLocale}
              aria-label={t.langSwitch}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 hover:border-[#3A8DDE] hover:text-[#3A8DDE] focus-visible:outline-2 focus-visible:outline-[#3A8DDE]"
              style={{ borderColor: "rgba(58,141,222,0.35)", color: "#3A8DDE" }}
            >
              <Globe size={13} />
              {locale === "ar" ? "EN" : "AR"}
            </button>
            <a
              href={CLINIC.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.ctaAria}
              className="px-5 py-2 rounded-full text-sm font-bold text-white transition-all duration-200 hover:shadow-[0_4px_16px_rgba(233,30,99,0.40)] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              style={{ background: "linear-gradient(135deg, #6BADEB 0%, #3A8DDE  100%)" }}
            >
              {t.cta}
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? t.menuClose : t.menuOpen}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="lg:hidden p-2 rounded-full text-gray-600 hover:text-[#E91E63] hover:bg-[#E91E63]/8 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#E91E63]"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        id="mobile-menu"
        role="navigation"
        aria-label={t.nav}
        className={`lg:hidden max-w-6xl mx-auto mt-2 rounded-2xl bg-white border border-gray-100 shadow-[0_8px_32px_rgba(0,0,0,0.10)] overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[560px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 py-3 space-y-1">
          {isAuthenticated && user && !isLoading && (
            <p className="px-4 py-2 text-xs font-medium text-gray-500 truncate" dir="ltr">
              {user.email}
            </p>
          )}
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:text-[#E91E63] hover:bg-[#E91E63]/8 transition-all duration-200"
            >
              {link[locale]}
            </a>
          ))}
          {isAuthenticated && !isLoading && (
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:text-[#E91E63] hover:bg-[#E91E63]/8 transition-all duration-200 disabled:opacity-60"
            >
              {loggingOut ? (isRTL ? "جارى الخروج..." : "Logging out...") : isRTL ? "تسجيل الخروج" : "Logout"}
            </button>
          )}
          <div className="h-px bg-gray-100 my-2" />
          <div className="flex items-center gap-2 px-1 pb-1">
            <button
              onClick={() => { toggleLocale(); closeMenu(); }}
              aria-label={t.langSwitch}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200"
              style={{ borderColor: "rgba(58,141,222,0.35)", color: "#3A8DDE" }}
            >
              <Globe size={13} />
              {locale === "ar" ? "EN" : "AR"}
            </button>
            <a
              href={CLINIC.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              aria-label={t.ctaAria}
              className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #E91E63 0%, #F06292 100%)" }}
            >
              {t.cta}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}