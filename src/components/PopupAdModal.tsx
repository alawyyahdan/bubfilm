"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface AdItem {
  imageUrl: string;
  linkUrl: string;
}

interface PopupAdsConfig {
  enabled: boolean;
  ads: AdItem[];
}

export default function PopupAdModal() {
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState<PopupAdsConfig | null>(null);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/admin/ads")
      .then((r) => r.json())
      .then((data) => {
        if (data.popup && data.popup.enabled && data.popup.ads && data.popup.ads.length > 0) {
          setConfig(data.popup);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (mounted && config && !closed) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = "auto"; };
    }
  }, [mounted, config, closed]);

  if (!mounted || !config || closed) return null;

  // Determine grid layout based on number of ads
  const count = config.ads.length;
  // Maximum 3 columns
  const cols = Math.min(3, Math.ceil(Math.sqrt(count)));

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl flex flex-col items-center">
        {/* Close Button above grid */}
        <button
          onClick={() => setClosed(true)}
          className="mb-4 bg-red-600 hover:bg-red-700 text-white p-2 sm:p-3 rounded-full flex items-center gap-2 font-bold shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all hover:scale-105"
        >
          <X size={20} /> <span className="text-sm">CLOSE</span>
        </button>
        
        {/* Ad Grid */}
        <div 
          className="grid gap-2 sm:gap-4 bg-zinc-900 p-2 sm:p-4 rounded-xl border border-white/10 shadow-2xl max-h-[70vh] overflow-y-auto w-full sm:w-auto"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {config.ads.map((ad, idx) => (
            <a 
              key={idx} 
              href={ad.linkUrl || "#"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="relative aspect-square w-full sm:w-[200px] md:w-[250px] lg:w-[300px] bg-black rounded-lg overflow-hidden block border border-white/5 hover:border-white/30 transition-all group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ad.imageUrl || undefined} alt="Advertisement" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-2 right-2 bg-black/80 text-white text-[9px] px-1.5 py-0.5 rounded border border-white/10 uppercase font-bold tracking-widest">
                Ad
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
