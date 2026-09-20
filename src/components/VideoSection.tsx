"use client";
import { useState } from "react";
import { Play, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useLocale } from "@/lib/LocaleContext";
import { UI } from "@/lib/i18n";

const VIDEO_ID = "2836039979809822";
const FB_EMBED = `https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fwatch%2F%3Fv%3D${VIDEO_ID}&show_text=0&width=560`;
const FB_WATCH = `https://www.facebook.com/watch/?v=${VIDEO_ID}`;

export default function VideoSection() {
  const { locale } = useLocale();
  const t = UI[locale];
  const [playing, setPlaying] = useState(false);

  return (
    <section className="section-padding bg-section-b">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="section-header">
          <span className="badge-secondary">{t.videoBadge}</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#2d1a1a] mt-3 mb-2 tracking-tight">
            {t.videoTitle} <span className="text-grad-secondary">{t.videoHighlight}</span>
          </h2>
          <div className="divider-primary" />
          <p className="text-[#6b7280] mt-4 text-sm max-w-lg mx-auto leading-relaxed">{t.videoDesc}</p>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-subtle border border-gray-100">
          {!playing ? (
            <div className="relative aspect-video bg-[#1a1a2e] flex items-center justify-center overflow-hidden">
              <Image src="/images/tv-interview.webp" alt={`${t.doctorName} — ${t.videoBadge}`}
                fill className="object-cover opacity-60" loading="lazy" />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2 shadow-subtle">
                <a href={FB_WATCH} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium text-[#E91E63] hover:text-[#C2185B] transition-colors">
                  <ExternalLink size={14} />{t.openFb}
                </a>
              </div>
              <button onClick={() => setPlaying(true)}
                className="relative z-10 btn-secondary w-16 h-16 rounded-full flex items-center justify-center shadow-primary"
                aria-label={t.playVideo}>
                <Play size={24} fill="white" />
              </button>
            </div>
          ) : (
            <div className="aspect-video">
              <video src="/videos/doctor_word.mp4" width="100%" height="100%" controls autoPlay title={`${t.videoTitle} ${t.videoHighlight}`}></video>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-xl px-3 gap-3 px-3 py-2 shadow-subtle">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
              <Image src="/images/pi2.jpg" alt={t.doctorName} width={40} height={40} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col ">  
              <p className="text-sm font-bold text-[#2d1a1a]">{t.doctorName}</p>
              <p className="text-xs text-[#6b7280]">{t.doctorSub}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
