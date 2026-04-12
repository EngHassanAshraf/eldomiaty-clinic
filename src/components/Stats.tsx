"use client";
import { useState, useEffect, useRef } from "react";
import { useLocale } from "@/lib/LocaleContext";
import { STATS_I18N } from "@/lib/i18n";
export { computeSequence } from "@/lib/computeSequence";

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref     = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1600, steps = 50, inc = target / steps;
        let cur = 0;
        const timer = setInterval(() => {
          cur = Math.min(cur + inc, target);
          setCount(Math.round(cur));
          if (cur >= target) clearInterval(timer);
        }, duration / steps);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-4xl sm:text-5xl font-black text-white animate-count">
      {count}{suffix}
    </div>
  );
}

export default function Stats() {
  const { locale } = useLocale();

  return (
    <section className="section-padding relative overflow-hidden grad-stats">
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "radial-gradient(circle,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {STATS_I18N.map((stat) => (
            <div key={stat.ar} className="bg-[rgba(58,141,222,0.3)] border border-white/20 rounded-2xl p-6 text-center transition-all duration-300 hover:bg-white/15 hover:border-white/30">
              <CountUp target={stat.value} suffix={stat.suffix} />
              <p className="text-white/85 text-sm font-semibold mt-2">{stat[locale]}</p>
              <div className="h-0.5 w-8 mx-auto rounded-full bg-white/30 mt-3" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
