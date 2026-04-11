"use client";
import { useState, useEffect, useRef } from "react";
import { STATS } from "@/lib/data";
export { computeSequence } from "@/lib/computeSequence";

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1600;
          const steps = 50;
          const inc = target / steps;
          let cur = 0;
          const timer = setInterval(() => {
            cur = Math.min(cur + inc, target);
            setCount(Math.round(cur));
            if (cur >= target) clearInterval(timer);
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
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
  return (
    <section className="section-padding relative overflow-hidden noise-overlay">
      {/* Gradient background */}
      <div aria-hidden="true" className="absolute inset-0 grad-stats" />
      {/* Softened overlay */}
      <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(232,41,74,0.92) 0%, rgba(242,92,116,0.88) 50%, rgba(249,168,180,0.80) 100%)' }} />
      {/* Dot pattern */}
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
      {/* Top edge highlight */}
      <div aria-hidden="true" className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.40), transparent)' }} />
      {/* Bottom edge highlight */}
      <div aria-hidden="true" className="absolute bottom-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="glass-dark rounded-3xl border border-white/12 group transition-all duration-300 hover:border-white/25 hover:shadow-[0_8px_32px_rgba(0,0,0,0.20)] p-6 text-center relative overflow-hidden"
            >
              <div aria-hidden="true" className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.08) 0%, transparent 70%)' }} />
              <CountUp target={stat.value} suffix={stat.suffix} />
              <p className="text-white/80 text-sm font-semibold mt-1.5">{stat.label}</p>
              <div className="h-0.5 w-10 mx-auto rounded-full bg-white/25 group-hover:w-16 group-hover:bg-white/50 transition-all duration-400 mt-3" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
