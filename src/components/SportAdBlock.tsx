"use client";
import { useState, useEffect } from "react";

interface AdItem { imageUrl: string; linkUrl: string; }

interface SportAdsConfig {
  bannerEnabled: boolean;
  bannerAds: AdItem[];   // 728x90, max 4
  squareEnabled: boolean;
  squareAds: AdItem[];   // 300x300, max 4
  sidebarEnabled: boolean;
  sidebarAds: AdItem[];  // 300x300, max 2
}

function AdLabel() {
  return (
    <div className="absolute top-1 right-1 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded border border-white/10 uppercase font-bold tracking-widest pointer-events-none z-10">
      Ad
    </div>
  );
}

function BannerSlot({ ad }: { ad: AdItem }) {
  return (
    <a href={ad.linkUrl || "#"} target="_blank" rel="noopener noreferrer"
      className="relative block w-full max-w-[728px] mx-auto bg-black rounded-lg overflow-hidden border border-white/5 hover:border-white/20 transition-all group shadow-lg"
      style={{ aspectRatio: "728/90" }}
    >
      <AdLabel />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={ad.imageUrl} alt="Advertisement" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
    </a>
  );
}

function SquareSlot({ ad }: { ad: AdItem }) {
  return (
    <a href={ad.linkUrl || "#"} target="_blank" rel="noopener noreferrer"
      className="relative block w-full bg-black rounded-lg overflow-hidden border border-white/5 hover:border-white/20 transition-all group shadow-lg"
      style={{ aspectRatio: "1/1" }}
    >
      <AdLabel />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={ad.imageUrl} alt="Advertisement" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
    </a>
  );
}

/** 
 * Renders the full ad zone BELOW the video player:
 * [728x90 banner top]
 * [300x300] [300x300]
 * [300x300] [300x300]
 * [728x90 banner bottom]
 */
export function SportPlayerAds() {
  const [cfg, setCfg] = useState<SportAdsConfig | null>(null);

  useEffect(() => {
    fetch("/api/admin/ads")
      .then(r => r.json())
      .then(d => { if (d.sportAds) setCfg(d.sportAds); })
      .catch(() => {});
  }, []);

  if (!cfg) return null;

  const hasBanner = cfg.bannerEnabled && cfg.bannerAds.length > 0;
  const hasSquare = cfg.squareEnabled && cfg.squareAds.length > 0;
  if (!hasBanner && !hasSquare) return null;

  const topBanners  = hasBanner ? cfg.bannerAds.slice(0, 2) : [];
  const botBanners  = hasBanner ? cfg.bannerAds.slice(2, 4) : [];
  const squares     = hasSquare ? cfg.squareAds.slice(0, 4)  : [];

  return (
    <div className="w-full space-y-3 mt-4">
      {/* Top banners (max 2) */}
      {topBanners.map((ad, i) => <BannerSlot key={`tb-${i}`} ad={ad} />)}

      {/* 2×2 square grid */}
      {squares.length > 0 && (
        <div className="grid grid-cols-2 gap-3 max-w-[628px] mx-auto">
          {squares.map((ad, i) => <SquareSlot key={`sq-${i}`} ad={ad} />)}
        </div>
      )}

      {/* Bottom banners (max 2) */}
      {botBanners.map((ad, i) => <BannerSlot key={`bb-${i}`} ad={ad} />)}
    </div>
  );
}

/**
 * Renders 2 × 300x300 square slots in the sidebar (below match info)
 */
export function SportSidebarAds() {
  const [cfg, setCfg] = useState<SportAdsConfig | null>(null);

  useEffect(() => {
    fetch("/api/admin/ads")
      .then(r => r.json())
      .then(d => { if (d.sportAds) setCfg(d.sportAds); })
      .catch(() => {});
  }, []);

  if (!cfg || !cfg.sidebarEnabled || cfg.sidebarAds.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 mt-4">
      {cfg.sidebarAds.slice(0, 2).map((ad, i) => (
        <SquareSlot key={`sb-${i}`} ad={ad} />
      ))}
    </div>
  );
}
