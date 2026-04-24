"use client";
import { useState, useEffect } from "react";
import { ShieldAlert, RefreshCw } from "lucide-react";

export default function AdBlockDetector() {
  const [isAdBlockDetected, setIsAdBlockDetected] = useState(false);

  const checkAdBlock = async () => {
    // Metode 1: Honeypot element
    const testAd = document.createElement("div");
    testAd.innerHTML = "&nbsp;";
    testAd.className = "adsbox ad-zone ads-banner";
    testAd.style.position = "absolute";
    testAd.style.left = "-9999px";
    testAd.style.top = "-9999px";
    document.body.appendChild(testAd);

    // Tunggu sebentar biar adblock beraksi
    await new Promise((resolve) => setTimeout(resolve, 100));

    const isBlocked = 
      testAd.offsetHeight === 0 || 
      window.getComputedStyle(testAd).display === "none" ||
      window.getComputedStyle(testAd).visibility === "hidden";
    
    document.body.removeChild(testAd);

    if (isBlocked) {
      setIsAdBlockDetected(true);
      return;
    }

    // Metode 2: Try fetching common ad script
    try {
      const response = await fetch("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", {
        method: "HEAD",
        mode: "no-cors",
        cache: "no-store",
      });
      setIsAdBlockDetected(false);
    } catch (err) {
      setIsAdBlockDetected(true);
    }
  };

  useEffect(() => {
    // Jalankan setelah page load
    const timer = setTimeout(() => {
      checkAdBlock();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isAdBlockDetected) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-red-500/20">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        
        <h2 className="text-2xl font-black text-white mb-3 tracking-tight">AdBlock Detected!</h2>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          Kami mendeteksi Anda menggunakan AdBlocker. Mohon nonaktifkan AdBlock Anda untuk terus menikmati layanan kami secara gratis. Iklan membantu kami menjaga server tetap menyala.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
        >
          <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          SAYA SUDAH MATIKAN
        </button>

        <p className="mt-6 text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
          Refresh halaman setelah mematikan AdBlock
        </p>
      </div>
    </div>
  );
}
