"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Server, SkipForward, X, ChevronDown } from "lucide-react";

interface VideoPlayerProps {
  type: "movie" | "tv" | "anime";
  id: number;
  season?: number;
  episode?: number;
  malId?: number | null;
  onClose?: () => void;
}

interface AdItem {
  imageUrl: string;
  linkUrl: string;
}

interface PreRollAdsConfig {
  enabled: boolean;
  type: "image" | "video";
  durationSeconds: number;
  videoUrl: string;
  videoLinkUrl: string;
  imageAds: AdItem[];
}

interface Provider {
  id: string;
  name: string;
  enabled: boolean;
  movieUrl: string;
  tvUrl: string;
  animeUrl: string;
}

function buildUrl(template: string, vars: { tmdb?: number; season?: number; episode?: number; mal?: number | null }) {
  return template
    .replace(/\{tmdb\}/g, String(vars.tmdb ?? ""))
    .replace(/\{season\}/g, String(vars.season ?? 1))
    .replace(/\{episode\}/g, String(vars.episode ?? 1))
    .replace(/\{mal\}/g, String(vars.mal ?? ""));
}

export default function VideoPlayer({ type, id, season = 1, episode = 1, malId, onClose }: VideoPlayerProps) {
  const [mounted, setMounted] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [adTime, setAdTime] = useState(5);
  const [adsConfig, setAdsConfig] = useState<PreRollAdsConfig | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";

    // Fetch ads config and providers in parallel
    Promise.all([
      fetch("/api/admin/ads").then(r => r.json()).catch(() => ({})),
      fetch("/api/admin/providers").then(r => r.json()).catch(() => []),
    ]).then(([data, providersCfg]: [any, Provider[]]) => {
      const cfg = data.preRoll;
      if (cfg && cfg.enabled) {
        setAdsConfig(cfg);
        setShowAd(true);
        setAdTime(cfg.durationSeconds ?? 5);
      }

      const active = (providersCfg || []).filter((p: Provider) => {
        if (!p.enabled) return false;
        if (type === "movie") return !!p.movieUrl;
        if (type === "tv") return !!p.tvUrl;
        if (type === "anime") return !!p.animeUrl;
        return false;
      });
      setProviders(active);
      if (active.length > 0) setSelectedProvider(active[0].id);
    });

    return () => { document.body.style.overflow = "auto"; };
  }, []);

  // Countdown
  useEffect(() => {
    if (showAd && adTime > 0) {
      const t = setTimeout(() => {
        const nextTime = adTime - 1;
        setAdTime(nextTime);
        // If image type, auto close when reaches 0
        if (nextTime === 0 && adsConfig?.type === "image") {
          setShowAd(false);
        }
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [showAd, adTime, adsConfig?.type]);

  const getIframeSrc = () => {
    const provider = providers.find(p => p.id === selectedProvider);
    if (!provider) return "";
    const vars = { tmdb: id, season, episode, mal: malId };
    if (type === "movie") return buildUrl(provider.movieUrl, vars);
    if (type === "tv") return buildUrl(provider.tvUrl, vars);
    if (type === "anime") return buildUrl(provider.animeUrl, vars);
    return "";
  };

  if (!mounted) return null;

  // ── AD SCREEN ──
  if (showAd && adsConfig?.enabled) {
    if (adsConfig.type === "image" && adsConfig.imageAds && adsConfig.imageAds.length > 0) {
      // IMAGE GRID AD (Auto closes, no skip button)
      const count = adsConfig.imageAds.length;
      const cols = Math.min(3, Math.ceil(Math.sqrt(count)));

      return createPortal(
        <div className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center p-4">
          <div className="mb-4 text-center">
            <p className="text-red-500 font-bold text-sm animate-pulse drop-shadow-lg">
              Memulai film dalam {adTime} detik...
            </p>
          </div>

          <div 
            className="grid gap-2 sm:gap-4 bg-zinc-900 p-2 sm:p-4 rounded-xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full sm:w-auto max-h-[70vh] overflow-y-auto"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {adsConfig.imageAds.map((ad, idx) => (
              <a 
                key={idx} 
                href={ad.linkUrl || "#"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="relative aspect-square w-full sm:w-[200px] md:w-[250px] lg:w-[300px] bg-black rounded-lg overflow-hidden block border border-white/5 hover:border-white/30 transition-all group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ad.imageUrl || undefined} alt="Ad" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 right-2 bg-black/80 text-white text-[9px] px-1.5 py-0.5 rounded border border-white/10 uppercase font-bold tracking-widest">
                  Ad
                </div>
              </a>
            ))}
          </div>
        </div>,
        document.body
      );
    } 
    
    if (adsConfig.type === "video" && adsConfig.videoUrl) {
      // VIDEO AD (Full screen, skip button after countdown)
      return createPortal(
        <div className="fixed inset-0 z-[99999] bg-black flex items-center justify-center">
          <a href={adsConfig.videoLinkUrl || "#"} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10 block cursor-pointer">
            <video 
              src={adsConfig.videoUrl} 
              autoPlay 
              playsInline 
              muted={false}
              className="w-full h-full object-contain bg-black"
              onEnded={() => setShowAd(false)}
            />
          </a>

          <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded text-xs text-gray-300 uppercase font-bold tracking-widest border border-white/10 z-20 pointer-events-none">
            Advertisement
          </div>

          <div className="absolute bottom-10 right-10 z-20">
            {adTime > 0 ? (
              <button disabled className="px-6 py-3 rounded-full bg-zinc-900/80 text-gray-400 font-bold border border-zinc-700 cursor-not-allowed flex items-center gap-2 text-sm backdrop-blur-sm shadow-xl">
                Skip Ad in {adTime}s
              </button>
            ) : (
              <button onClick={() => setShowAd(false)} className="px-8 py-3 rounded-full bg-white text-black font-black hover:bg-gray-200 transition-colors animate-bounce flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.4)] text-base">
                Skip Ad <SkipForward size={18} />
              </button>
            )}
          </div>
        </div>,
        document.body
      );
    }
    
    // Fallback if config is invalid but enabled, just skip
    setShowAd(false);
  }

  // ── VIDEO PLAYER ──
  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-black animate-fade-in">
      <div className="fixed top-0 left-0 right-0 p-3 sm:p-5 flex justify-between items-start z-[999999] pointer-events-none">
        {/* Server Dropdown */}
        <div className="relative pointer-events-auto">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-black/80 hover:bg-black backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-full text-white font-bold text-xs sm:text-sm transition-all shadow-xl"
          >
            <Server size={16} className="text-red-500" />
            <span className="hidden sm:inline">{providers.find(p => p.id === selectedProvider)?.name || "Server"}</span>
            <span className="sm:hidden">Server</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-56 sm:w-64 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[60]">
              <div className="px-4 py-2.5 bg-zinc-950 border-b border-white/5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                Select Server
              </div>
              {providers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedProvider(p.id); setDropdownOpen(false); }}
                  className={`w-full px-4 py-3.5 text-left text-sm font-semibold transition-colors flex items-center gap-2 ${
                    selectedProvider === p.id ? "bg-red-600/10 text-red-500" : "text-gray-300 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  {p.name}
                  {selectedProvider === p.id && <div className="ml-auto w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {onClose && (
          <button onClick={onClose} className="pointer-events-auto text-white/80 hover:text-white bg-black/80 hover:bg-red-600 backdrop-blur-md border border-white/20 p-2.5 sm:p-3 rounded-full transition-all shadow-xl">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="absolute inset-0 w-full h-full bg-black">
        <iframe
          src={getIframeSrc() || undefined}
          className="w-full h-full border-none"
          allowFullScreen
          allow="encrypted-media; autoplay; fullscreen; picture-in-picture"
          referrerPolicy="no-referrer"
          title="Video Player"
        />
      </div>
    </div>,
    document.body
  );
}
