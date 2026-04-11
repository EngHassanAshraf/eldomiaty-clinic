"use client";
import { useState } from "react";
import { Play, ExternalLink } from "lucide-react";
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
          <span className="badge-rose">من العيادة</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#2d1a1a] mt-3 mb-2 tracking-tight">
            كلمة <span className="text-grad-rose">الدكتور</span>
          </h2>
          <div className="divider-rose" />
          <p className="text-[#8a6a6a] mt-4 text-sm max-w-lg mx-auto leading-relaxed">
            لكل سيدة بتحلم بطفل، أو عندها مشاكل فى الحمل، أو حامل، أو مقبلة على الولادة
          </p>
        </div>

        {/* Video card — Task 7.1 */}
        <div className="rounded-3xl overflow-hidden shadow-rose-xl border border-[#fad4db]/50 relative">
          {/* Top highlight line — Task 7.1 */}
          <div
            aria-hidden="true"
            className="absolute top-0 inset-x-0 h-px z-10"
            style={{ background: "linear-gradient(90deg, transparent, #fad4db, transparent)" }}
          />

          {/* Pre-play overlay — Task 7.2 */}
          {!playing ? (
            <div className="relative aspect-video bg-[#2d1a1a] flex items-center justify-center overflow-hidden">
              {/* Orb 1 */}
              <div
                aria-hidden="true"
                className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(250,212,219,0.25) 0%, transparent 70%)", filter: "blur(30px)" }}
              />
              {/* Orb 2 */}
              <div
                aria-hidden="true"
                className="absolute bottom-0 left-0 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(232,41,74,0.20) 0%, transparent 70%)", filter: "blur(25px)" }}
              />

              {/* Floating logo card */}
              <div className="absolute top-6 right-6 glass-rose rounded-2xl p-3 shadow-card animate-float flex items-center gap-2">
                <div className="w-8 h-8 grad-rose rounded-xl flex items-center justify-center">
                  <span className="text-white text-xs font-bold">د</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#2d1a1a]">د. محمد الدمياطي</p>
                  <p className="text-[10px] text-[#8a6a6a]">استشارى نساء وتوليد</p>
                </div>
              </div>

              {/* Play button */}
              <button
                onClick={() => setPlaying(true)}
                className="btn-rose animate-pulse-rose w-16 h-16 rounded-full flex items-center justify-center text-white shadow-rose-xl"
                aria-label="تشغيل الفيديو"
              >
                <Play size={24} fill="white" />
              </button>
            </div>
          ) : (
            /* Facebook iframe — Task 7.3 */
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

        {/* Bottom info bar — Task 7.4 */}
        <div className="flex items-center justify-between mt-4 px-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 grad-rose rounded-xl flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">د</span>
            </div>
            <div>
              <p className="text-sm font-bold text-[#2d1a1a]">د. محمد الدمياطي</p>
              <p className="text-xs text-[#8a6a6a]">استشارى نساء وتوليد وحقن مجهرى</p>
            </div>
          </div>
          <a
            href={CLINIC.facebook || FB_WATCH}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-[#e8294a] hover:text-[#f25c74] transition-colors"
          >
            <ExternalLink size={14} />
            فتح على فيسبوك
          </a>
        </div>

      </div>
    </section>
  );
}
