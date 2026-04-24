"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export default function Footer() {
  const [siteName, setSiteName] = useState("WebStreaming");
  const [logoType, setLogoType] = useState("text");
  const [logoText, setLogoText] = useState("");
  const [logoImageUrl, setLogoImageUrl] = useState("");
  const [advertiseEmail, setAdvertiseEmail] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/admin/site")
      .then(r => r.json())
      .then(d => {
        setSiteName(d.siteName || "WebStreaming");
        setLogoType(d.logoType || "text");
        setLogoText(d.logoText || "");
        setLogoImageUrl(d.logoImageUrl || "");
        setAdvertiseEmail(d.advertiseEmail || "");
      })
      .catch(() => {});
  }, []);

  const handleAdMouseEnter = () => {
    if (tooltipRef.current) clearTimeout(tooltipRef.current);
    setShowTooltip(true);
  };
  const handleAdMouseLeave = () => {
    tooltipRef.current = setTimeout(() => setShowTooltip(false), 200);
  };

  return (
    <footer className="w-full bg-zinc-950 py-12 px-4 border-t border-white/5 relative z-40">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">

        {/* Logo Wrapper for Shadow (to prevent clipping) */}
        <div 
          className="mb-6 transition-all duration-300 hover:scale-105 inline-block"
          style={{ filter: "drop-shadow(0 0 15px rgba(220, 38, 38, 0.4))" }}
        >
          {logoType === "image" && logoImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoImageUrl} alt={siteName} className="h-10 object-contain" />
          ) : (
            <span 
              className="text-4xl font-black italic tracking-tighter select-none px-4 py-2 inline-block leading-none"
              style={{
                background: "linear-gradient(to bottom, #ff4d4d 0%, #ff0000 45%, #800000 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {logoText || siteName}
            </span>
          )}
        </div>

        {/* Disclaimer */}
        <p className="text-zinc-500 text-xs sm:text-sm max-w-2xl leading-relaxed mb-6">
          {siteName} does not host, store, or distribute any media files. All content is sourced from third-party providers.
        </p>

        {/* Links row - Perfectly Balanced */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold select-none w-full max-w-[300px] mx-auto">
          {/* DMCA - Align Right */}
          <div className="text-right">
            <Link
              href="/dmca"
              className="text-zinc-500 hover:text-red-500 transition-colors duration-200"
            >
              DMCA
            </Link>
          </div>

          {/* Separator - The Center Pivot */}
          <span className="text-zinc-800 font-normal">|</span>

          {/* Advertising - Align Left */}
          <div className="text-left">
            <div
              className="relative inline-block"
              onMouseEnter={handleAdMouseEnter}
              onMouseLeave={handleAdMouseLeave}
            >
              <span className="text-zinc-500 hover:text-red-500 transition-colors duration-200 cursor-pointer">
                Advertising
              </span>

              {showTooltip && (
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
                  onMouseEnter={handleAdMouseEnter}
                  onMouseLeave={handleAdMouseLeave}
                >
                  <div className="bg-zinc-900 border border-white/10 text-[11px] rounded-xl px-5 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] whitespace-nowrap pointer-events-auto ring-1 ring-red-500/20">
                    {advertiseEmail ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-zinc-500 text-[9px] font-black tracking-widest uppercase">Contact Email</span>
                        <a
                          href={`mailto:${advertiseEmail}`}
                          className="text-red-500 hover:text-red-400 flex items-center gap-2 transition-colors font-black"
                        >
                          <span className="text-sm">✉</span>
                          {advertiseEmail}
                        </a>
                      </div>
                    ) : (
                      <span className="text-zinc-500 italic">Admin belum set email iklan</span>
                    )}
                  </div>
                  <div className="flex justify-center -mt-px">
                    <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-zinc-900" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
