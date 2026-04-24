"use client";
import { useEffect, useRef, useState } from "react";

export default function SportChat() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<{ id: string, handle: string } | null>(null);

  useEffect(() => {
    // Fetch config from site settings
    fetch("/api/admin/site")
      .then(r => r.json())
      .then(d => {
        setConfig({
          id: d.chatangoId || "cid0020000437940472083",
          handle: d.chatangoHandle || "bububfilm"
        });
      })
      .catch(() => {
        // Fallback to default
        setConfig({
          id: "cid0020000437940472083",
          handle: "bububfilm"
        });
      });
  }, []);

  useEffect(() => {
    if (!config) return;

    // Remove existing if any (to avoid double injection)
    const existing = document.getElementById(config.id);
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = config.id;
    script.dataset.cfasync = "false";
    script.async = true;
    script.src = "//st.chatango.com/js/gz/emb.js";
    script.style.width = "100%";
    script.style.height = "100%";
    
    const chatConfig = {
      "handle": config.handle,
      "arch": "js",
      "styles": {
        "a": "383838",
        "b": 100,
        "c": "ff6600",
        "d": "FFFFFF",
        "k": "383838",
        "l": "383838",
        "m": "383838",
        "n": "FFFFFF",
        "p": "10",
        "q": "383838",
        "r": 100,
        "surl": 0,
        "fwtickm": 1
      }
    };
    
    script.innerHTML = JSON.stringify(chatConfig);

    if (containerRef.current) {
      containerRef.current.innerHTML = ""; // Clear before adding
      containerRef.current.appendChild(script);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [config]);

  return (
    <div className="w-full bg-zinc-900 border border-white/5 rounded-xl overflow-hidden flex flex-col shadow-xl">
      <div className="px-5 py-3 border-b border-white/5 bg-zinc-900/50 flex items-center justify-between">
        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          Live Chat
        </h3>
        <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">Powered by Chatango</span>
      </div>
      <div 
        ref={containerRef} 
        className="w-full h-[450px] sm:h-[500px] bg-zinc-900"
      />
    </div>
  );
}
