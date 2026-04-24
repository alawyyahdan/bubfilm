"use client";
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      setVisible(document.documentElement.scrollTop > 300);
    };
    window.addEventListener("scroll", toggleVisible);
    return () => window.removeEventListener("scroll", toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-8 right-8 z-50 p-3.5 rounded-full text-white transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) hover:scale-110 active:scale-90 group border border-white/10 overflow-hidden shadow-[0_10px_25px_-5px_rgba(220,38,38,0.5),0_8px_10px_-6px_rgba(0,0,0,0.3)]"
      style={{
        background: "linear-gradient(145deg, #e74c3c, #800000)",
      }}
    >
      {/* Metallic Gloss Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/20 pointer-events-none" />
      
      {/* Inner Rim Light */}
      <div className="absolute inset-[1px] rounded-full border border-white/5 pointer-events-none" />

      {/* Shine Highlight */}
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <ArrowUp 
        size={22} 
        className="relative z-10 transition-transform duration-500 group-hover:-translate-y-1 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]" 
      />
    </button>
  );
}
