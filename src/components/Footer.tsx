import Image from "next/image";
import { Heart } from "lucide-react";
import { CLINIC, BRANCHES } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-[#2d1a1a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-white/10 p-1">
                <Image src="/logo.png" alt="شعار العيادة" fill className="object-contain" />
              </div>
              <div>
                <p className="font-black text-white">د. محمد الدمياطي</p>
                <p className="text-xs text-[#c4a0a0]">نساء · توليد · حقن مجهرى</p>
              </div>
            </div>
            <p className="text-[#c4a0a0] text-sm leading-relaxed max-w-sm">
              استشارى أمراض النساء والتوليد والحقن المجهرى والمناظير بطب القصر
              العينى جامعة القاهرة. عضو الجمعية الملكية البريطانية والجمعية
              الأمريكية للإنجاب.
            </p>
            <div className="flex gap-2">
              {[
                { href: CLINIC.facebook,     char: "f" },
                { href: CLINIC.youtube,      char: "▶" },
                { href: CLINIC.instagram,    char: "◎" },
                { href: CLINIC.whatsappLink, char: "✉" },
              ].map((s) => (
                <a key={s.char} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#e8294a] flex items-center justify-center text-[#c4a0a0] hover:text-white text-xs font-bold transition-all">
                  {s.char}
                </a>
              ))}
            </div>
          </div>

          {/* Branches */}
          <div>
            <h4 className="font-black text-white mb-4 text-sm">فروعنا</h4>
            <ul className="space-y-2">
              {BRANCHES.map((b) => (
                <li key={b.id}>
                  <a href="#branches" className="text-[#c4a0a0] hover:text-[#f25c74] text-sm transition-colors">
                    {b.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-black text-white mb-4 text-sm">روابط سريعة</h4>
            <ul className="space-y-2">
              {[
                { href: "#about",        label: "عن الدكتور" },
                { href: "#services",     label: "الخدمات" },
                { href: "#testimonials", label: "آراء المرضى" },
                { href: "#contact",      label: "اتصل بنا" },
              ].map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-[#c4a0a0] hover:text-[#f25c74] text-sm transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8a6a6a]">
          <p>© {new Date().getFullYear()} عيادة دكتور محمد الدمياطي. جميع الحقوق محفوظة.</p>
          <p className="flex items-center gap-1">
            صُنع بـ <Heart size={12} className="text-[#e8294a] fill-[#e8294a]" /> لصحة المرأة المصرية
          </p>
        </div>
      </div>
    </footer>
  );
}
