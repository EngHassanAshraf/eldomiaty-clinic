"use client";
import { useState } from "react";
import { Play, ExternalLink } from "lucide-react";
import Image from "next/image";
import { CLINIC } from "@/lib/data";

const VIDEO_ID = "2836039979809822";
const FB_EMBED = `https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fwatch%2F%3Fv%3D${VIDEO_ID}&show_text=0&width=560`;
const FB_WATCH = `https://www.facebook.com/watch/?v=${VIDEO_ID}`;

export default function VideoSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="section-padding bg-section-b">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        <div className="section-header">
          <span className="badge-primary">من العيادة</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#2d1a1a] mt-3 mb-2 tracking-tight">
            كلمة <span className="text-grad-primary">الدكتور</span>
          </h2>
          <div className="divider-primary" />
          <p className="text-[#6b7280] mt-4 text-sm max-w-lg mx-auto leading-relaxed">
            لكل سيدة بتحلم بطفل، أو عندها مشاكل فى الحمل، أو حامل، أو مقبلة على الولادة
          </p>
        </div>

        {/* Video card */}
        <div className="rounded-2xl overflow-hidden shadow-subtle border border-gray-100">

          {!playing ? (
            <div className="relative aspect-video bg-[#1a1a2e] flex items-center justify-center overflow-hidden">
              {/* TV interview thumbnail */}
              <Image
                src="/tv-interview.webp"
                alt="مقابلة تلفزيونية مع دكتور محمد الدمياطي"
                fill
                className="object-cover opacity-60"
                loading="lazy"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

              {/* Doctor info — top */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2 shadow-subtle">
                <div className="w-7 h-7 grad-primary rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">د</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#2d1a1a]">د. محمد الدمياطي</p>
                  <p className="text-[10px] text-[#6b7280]">استشارى نساء وتوليد</p>
                </div>
              </div>

              {/* Play button */}
              <button
                onClick={() => setPlaying(true)}
                className="relative z-10 btn-primary w-16 h-16 rounded-full flex items-center justify-center shadow-primary"
                aria-label="تشغيل الفيديو"
              >
                <Play size={24} fill="white" />
              </button>
            </div>
          ) : (
            <div className="aspect-video">
              <iframe
                src={FB_EMBED}
                width="100%"
                height="100%"
                style={{ border: "none", overflow: "hidden" }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="فيديو دكتور محمد الدمياطي"
              />
            </div>
          )}
        </div>

        {/* Bottom info bar */}
        <div className="flex items-center justify-between mt-4 px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 grad-primary rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">د</span>
            </div>
            <div>
              <p className="text-sm font-bold text-[#2d1a1a]">د. محمد الدمياطي</p>
              <p className="text-xs text-[#6b7280]">استشارى نساء وتوليد وحقن مجهرى</p>
            </div>
          </div>
          <a
            href={CLINIC.facebook || FB_WATCH}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-[#e8294a] hover:text-[#c0392b] transition-colors"
          >
            <ExternalLink size={14} />
            فتح على فيسبوك
          </a>
        </div>

      </div>
    </section>
  );
}
