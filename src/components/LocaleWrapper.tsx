"use client";
import { useLocale } from "@/lib/LocaleContext";

export default function LocaleWrapper({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();
  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} lang={locale} className="min-h-screen">
      {children}
    </div>
  );
}
