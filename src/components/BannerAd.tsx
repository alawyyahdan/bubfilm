"use client";
import { useState, useEffect } from "react";

interface AdItem {
  imageUrl: string;
  linkUrl: string;
}

interface BannerAdsConfig {
  homeEnabled: boolean;
  homeAds: AdItem[];
  detailEnabled: boolean;
  detailAds: AdItem[];
}

interface BannerAdProps {
  location: "home" | "detail";
  rowIndex?: number;
}

export default function BannerAd({ location, rowIndex = 0 }: BannerAdProps) {
  const [config, setConfig] = useState<BannerAdsConfig | null>(null);

  useEffect(() => {
    fetch("/api/admin/ads")
      .then(r => r.json())
      .then(d => {
        if (d.bannerAds) setConfig(d.bannerAds);
      })
      .catch(() => {});
  }, []);

  if (!config) return null;

  if (location === "home" && config.homeEnabled && config.homeAds.length > 0) {
    const ads = config.homeAds;
    const startIndex = rowIndex * 2;
    const rowAds = ads.slice(startIndex, startIndex + 2);

    if (rowAds.length === 0) return null;

    return (
      <div className="w-full -mt-8 mb-6 px-4 md:px-10 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-[1500px] mx-auto justify-items-center">
          {rowAds.map((ad, idx) => (
            <a 
              key={idx} 
              href={ad.linkUrl || "#"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="relative w-full max-w-[728px] max-h-[90px] aspect-[8/1] sm:aspect-[728/90] bg-black rounded-lg overflow-hidden border border-white/5 hover:border-white/20 transition-all block group shadow-lg"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ad.imageUrl} alt="Advertisement" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-1 right-1 bg-black/60 text-white text-[8px] sm:text-[10px] px-1.5 py-0.5 rounded border border-white/10 uppercase font-bold tracking-widest pointer-events-none">
                Ad
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  }

  if (location === "detail" && config.detailEnabled && config.detailAds.length > 0) {
    const ads = config.detailAds;
    // Max 4 ads (2x2 grid)
    
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ads.slice(0, 4).map((ad, idx) => (
            <a 
              key={idx} 
              href={ad.linkUrl || "#"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="relative w-full max-w-[728px] max-h-[90px] mx-auto aspect-[8/1] sm:aspect-[728/90] bg-black rounded-lg overflow-hidden border border-white/5 hover:border-white/20 transition-all block group shadow-lg"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ad.imageUrl} alt="Advertisement" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-1 right-1 bg-black/60 text-white text-[8px] sm:text-[10px] px-1.5 py-0.5 rounded border border-white/10 uppercase font-bold tracking-widest pointer-events-none">
                Ad
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
