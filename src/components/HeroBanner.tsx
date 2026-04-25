"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Play, Info, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { tmdbImg } from "@/lib/tmdb";
import type { TMDBMedia } from "@/lib/tmdb";
import type { AniListMedia } from "@/lib/anilist";

type HeroItem = (TMDBMedia & { media_type?: string; videoKey?: string | null }) |
  (AniListMedia & { _type: "anime"; videoKey?: string | null });

interface HeroBannerProps { 
  items: HeroItem[];
  siteName?: string;
}

function getTitle(item: HeroItem) {
  if ("_type" in item) return (item as AniListMedia).title.english || (item as AniListMedia).title.romaji;
  const m = item as TMDBMedia; return m.title || m.name || "";
}
function getBackdrop(item: HeroItem) {
  if ("_type" in item) { const a = item as AniListMedia; return a.bannerImage || a.coverImage.extraLarge; }
  const m = item as TMDBMedia;
  return m.backdrop_path ? tmdbImg(m.backdrop_path, "original") : tmdbImg(m.poster_path, "original");
}
function getOverview(item: HeroItem) {
  if ("_type" in item) return (item as AniListMedia).description?.replace(/<[^>]*>/g, "") || "";
  return (item as TMDBMedia).overview || "";
}
function getYear(item: HeroItem) {
  if ("_type" in item) return String((item as AniListMedia).seasonYear || "");
  const m = item as TMDBMedia; return (m.release_date || m.first_air_date || "").slice(0, 4);
}
function getScore(item: HeroItem) {
  if ("_type" in item) return Math.round(((item as AniListMedia).averageScore || 0) / 10);
  return Math.round((item as TMDBMedia).vote_average * 10);
}
function getDetailPath(item: HeroItem) {
  if ("_type" in item) return `/anime/${(item as AniListMedia).id}`;
  const m = item as TMDBMedia;
  return `/${m.media_type === "tv" ? "tv" : "movie"}/${m.id}`;
}

export default function HeroBanner({ items, siteName = "Film" }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const DURATION = 8000;

  const goTo = useCallback((idx: number) => {
    if (transitioning || idx === current) return;
    setTransitioning(true);
    setPrev(current);
    setCurrent(idx);
    setProgress(0);
    setTimeout(() => { setPrev(null); setTransitioning(false); }, 700);
  }, [current, transitioning]);

  const next = useCallback(() => goTo((current + 1) % items.length), [current, items.length, goTo]);

  // Progress bar ticker
  useEffect(() => {
    setProgress(0);
    if (progressRef.current) clearInterval(progressRef.current);
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(progressRef.current!); return 100; }
        return p + (100 / (DURATION / 100));
      });
    }, 100);
    const timer = setTimeout(next, DURATION);
    return () => { clearTimeout(timer); if (progressRef.current) clearInterval(progressRef.current); };
  }, [current, next]);

  if (!items.length) return <div className="h-screen bg-zinc-950" />;

  const item = items[current];
  const prevItem = prev !== null ? items[prev] : null;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-zinc-950 z-20 group">

      {/* ── PROGRESS BAR ── */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-white/10 pointer-events-none">
        <div
          className="h-full bg-red-600 transition-none"
          style={{ width: `${progress}%`, transition: "width 0.1s linear" }}
        />
      </div>

      {/* ── PREVIOUS SLIDE (fading out) ── */}
      {prevItem && (
        <div className="absolute inset-0 z-10 animate-fade-out pointer-events-none">
          <Image src={getBackdrop(prevItem)} alt="" fill className="object-cover object-center" sizes="100vw" />
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute bottom-0 left-0 right-0 h-48 hero-bottom-gradient" />
        </div>
      )}

      {/* ── CURRENT SLIDE BACKDROP ── */}
      <div className={`absolute inset-0 z-10 ${transitioning ? "animate-fade-in" : "opacity-100"}`}>
        <Image
          src={getBackdrop(item)}
          alt={getTitle(item)}
          fill priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute bottom-0 left-0 right-0 h-48 hero-bottom-gradient" />
      </div>

      {/* ── CONTENT ── */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 w-full pt-16">
          <div
            key={current}
            className="max-w-xl animate-slide-up"
          >
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3 text-red-500">{siteName} FILM</p>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-2xl">
              {getTitle(item)}
            </h1>

            <div className="flex items-center gap-2 sm:gap-3 mb-4 flex-wrap">
              <span className="flex items-center gap-1 text-yellow-400 font-bold text-sm sm:text-base drop-shadow">
                <Star size={16} fill="currentColor" /> {getScore(item).toFixed(1)}
              </span>
              <span className="text-gray-400">&bull;</span>
              <span className="text-gray-300 text-sm sm:text-base drop-shadow">{getYear(item)}</span>
              <span className="text-gray-400">&bull;</span>
              <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded border border-white/20 text-white bg-white/10 drop-shadow">HD</span>
              <span className="text-gray-400">&bull;</span>
              <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded text-green-400 bg-green-900/40 border border-green-500/30 tracking-wider">
                {("media_type" in item && item.media_type === "tv") || ("_type" in item && item._type === "anime") ? "ONGOING" : "COMPLETED"}
              </span>
            </div>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-3 mb-7 max-w-md">
              {getOverview(item)}
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => router.push(getDetailPath(item))}
                className="hero-btn-play flex items-center gap-2 px-7 py-3 rounded-lg font-bold text-white text-sm transition-all hover:scale-105 active:scale-95"
              >
                <Play size={18} fill="white" /> Play
              </button>
              <button
                onClick={() => router.push(getDetailPath(item))}
                className="hero-btn-info flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white text-sm transition-all hover:scale-105 active:scale-95 border border-white/20 hover:bg-white/10"
              >
                <Info size={18} /> More Info
              </button>
            </div>
          </div>
        </div>

        {/* ── ARROWS ── */}
        <button
          onClick={() => goTo((current - 1 + items.length) % items.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all opacity-0 group-hover:opacity-100 z-30"
          aria-label="Previous slide"
        >
          <ChevronLeft size={32} />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all opacity-0 group-hover:opacity-100 z-30"
          aria-label="Next slide"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* ── DOT PAGINATION ── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {items.slice(0, 10).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1 transition-all duration-300 rounded-full ${i === current ? "w-8 bg-red-600" : "w-2 bg-white/30 hover:bg-white/50"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
