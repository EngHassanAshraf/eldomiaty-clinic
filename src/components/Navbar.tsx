"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, Globe } from "lucide-react";
import Image from "next/image";
import { CLINIC } from "@/lib/data";
import { useLocale } from "@/lib/LocaleContext";
import { UI } from "@/lib/i18n";
import { useAuth } from "@/contexts/auth-context";
import { getNavbarLinks, getNavbarVariant } from "@/components/navbar-config";
import { getAccountMenuItems } from "@/components/navbar-menu";
import { getProfileDisplayName } from "@/lib/user";
import { AccountDropdown } from "@/components/ui/AccountDropdown";
import Skeleton from "@/components/ui/Skeleton";

export default function Navbar() {
  const { locale, setLocale } = useLocale();
  const pathname = usePathname();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isRTL = locale === "ar";
  const t = UI[locale];
  const variant = getNavbarVariant(pathname ?? "/", user?.role);
  const navLinks = getNavbarLinks(variant);
  const displayName = getProfileDisplayName(user ?? { email: "" });
  const accountItems = user ? getAccountMenuItems(user.role, locale) : [];

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
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group" aria-label={CLINIC.name}>
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
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label={t.nav}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-sm font-medium text-gray-600 rounded-full hover:text-[#E91E63] hover:bg-[#E91E63]/8 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#E91E63] focus-visible:outline-offset-2"
              >
                {link.label[locale]}
              </Link>
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

            {/* Skeleton placeholders while auth state is resolving.
                Widths approximate the Arabic login/register button text so
                the pill width stays stable and no layout shift occurs. */}
            {isLoading && (
              <>
                <Skeleton className="h-9 w-[96px] rounded-[10px]" />
                <Skeleton className="h-9 w-[88px] rounded-[10px]" />
              </>
            )}

            {!isLoading && !isAuthenticated && (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-[10px] border border-[#E91E63]/20 bg-white px-2 py-2 text-sm font-semibold text-[#E91E63] transition-all duration-200 hover:border-[#E91E63]/35 hover:bg-[#FDE8EF]"
                >
                  {isRTL ? "تسجيل الدخول" : "Login"}
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-[10px] bg-[#FCE7F0] px-2 py-2 text-sm font-semibold text-[#E91E63] transition-all duration-200 hover:bg-[#F8C4D9]"
                >
                  {isRTL ? "إنشاء حساب" : "Register"}
                </Link>
              </>
            )}

            {!isLoading && isAuthenticated && user && (
              <>
              <AccountDropdown
                displayName={displayName}
                items={accountItems}
                onAction={(item) => {
                  if (item.action === "logout") {
                    void handleLogout();
                  }
                }}
              />
              <a
                  href={CLINIC.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.ctaAria}
                  className="inline-flex items-center justify-center rounded-[10px] px-2 py-2 text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_4px_16px_rgba(233,30,99,0.40)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                  style={{ background: "linear-gradient(135deg, #6BADEB 0%, #3A8DDE 100%)" }}
                >
                  {t.cta}
                </a>
                </>
            )}

            <button
              onClick={toggleLocale}
              aria-label={t.langSwitch}
              className="inline-flex items-center justify-center gap-1.5 rounded-[10px] border px-2 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer hover:border-[#3A8DDE] hover:text-[#3A8DDE] hover:bg-[#FDE8EF]"
              style={{ borderColor: "rgba(58,141,222,0.35)", color: "#3A8DDE" }}
            >
              {locale === "ar" ? <> <Globe size={13} />EN</>  : <><Globe size={13} /> ع ر</>}
            </button>
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
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#FFF7FA] px-3 py-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E91E63]/15 text-sm font-bold text-[#E91E63]">
                {displayName.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-800">{displayName}</p>
                <p className="truncate text-xs text-gray-500" dir="ltr">{user.email}</p>
              </div>
            </div>
          )}
          {!isLoading && isAuthenticated && user && (
            <div className="rounded-2xl border border-gray-200 bg-white p-2">
              {accountItems.map((item) => {
                if (item.action === "logout") {
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        closeMenu();
                        void handleLogout();
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-[#FDE8EF] hover:text-[#E91E63]"
                    >
                      <span>{item.label[locale]}</span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.key}
                    href={item.href!}
                    onClick={closeMenu}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-[#FDE8EF] hover:text-[#E91E63]"
                  >
                    <span>{item.label[locale]}</span>
                  </Link>
                );
              })}
            </div>
          )}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:text-[#E91E63] hover:bg-[#E91E63]/8 transition-all duration-200"
            >
              {link.label[locale]}
            </Link>
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
          <div className="flex flex-col gap-2 px-1 pb-1">
            {/* Skeleton placeholders while auth state is resolving.
                h-11 matches the mobile CTA link height and w-full fills the
                column so no reflow occurs when real buttons pop in. */}
            {isLoading && (
              <>
                <Skeleton className="h-11 w-full rounded-[10px]" />
                <Skeleton className="h-11 w-full rounded-[10px]" />
              </>
            )}

            {!isLoading && !isAuthenticated && (
              <>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="inline-flex h-11 items-center justify-center rounded-[10px] border border-[#E91E63]/20 bg-white px-4 text-sm font-semibold text-[#E91E63] transition-all duration-300 hover:border-[#E91E63]/35 hover:bg-[#FDE8EF]"
                >
                  {isRTL ? "تسجيل الدخول" : "Login"}
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[#FCE7F0] px-4 text-sm font-semibold text-[#E91E63] transition-all duration-300 hover:bg-[#F8C4D9]"
                >
                  {isRTL ? "إنشاء حساب" : "Register"}
                </Link>
              </>
            )}
            <button
              onClick={() => { toggleLocale(); closeMenu(); }}
              aria-label={t.langSwitch}
              className="flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-200"
              style={{ borderColor: "rgba(58,141,222,0.35)", color: "#3A8DDE" }}
            >
              <Globe size={13} />
              {locale === "ar" ? "EN" : "AR"}
            </button>
            {!isLoading && !isAuthenticated && (
              <a
                href={CLINIC.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                aria-label={t.ctaAria}
                className="inline-flex h-11 items-center justify-center rounded-[10px] px-5 text-sm font-bold text-white transition-all duration-300"
                style={{ background: "linear-gradient(135deg, #6BADEB 0%, #3A8DDE 100%)" }}
              >
                {t.cta}
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}