"use client";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SportCard from "./SportCard";
import { SportMatch } from "@/lib/sport";

// Skeleton card
function SkeletonSportCard({ layout }: { layout: "slider" | "grid" }) {
  const cls = layout === "grid"
    ? "animate-pulse"
    : "flex-shrink-0 w-44 sm:w-52 lg:w-60 animate-pulse";
  return (
    <div className={cls}>
      <div className="rounded-xl bg-zinc-800 aspect-video" />
      <div className="mt-2 flex flex-col gap-1.5 px-0.5">
        <div className="h-3 w-full bg-zinc-800 rounded" />
        <div className="h-2.5 w-2/3 bg-zinc-800 rounded" />
      </div>
    </div>
  );
}

interface LazySportSectionProps {
  title: string;
  emoji: string;
  sport?: string;
  type?: "live" | "popular" | "all";
  seeAllHref?: string;
  initialData?: SportMatch[];
  layout?: "slider" | "grid";
  /** If true, live matches appear first in the list */
  liveFirst?: boolean;
  /** If true, only show live matches from the data */
  liveOnly?: boolean;
}

export default function LazySportSection({
  title, emoji, sport, type = "all", seeAllHref,
  initialData, layout = "slider", liveFirst = true, liveOnly = false,
}: LazySportSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [matches, setMatches] = useState<SportMatch[] | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          const params = new URLSearchParams();
          if (sport) params.set("sport", sport);
          if (type) params.set("type", type);
          fetch(`/api/sports?${params}`)
            .then(r => r.json())
            .then((data: SportMatch[]) => {
              setMatches(Array.isArray(data) ? data : []);
              setLoading(false);
            })
            .catch(() => { setMatches([]); setLoading(false); });
        }
      },
      { rootMargin: "200px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [sport, type, initialData]);

  const scroll = (dir: "left" | "right") => {
    if (rowRef.current) {
      const amount = rowRef.current.clientWidth * 0.75;
      rowRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    }
  };

  if (!loading && matches !== null && matches.length === 0) return null;

  // Sort: live first, then by timestamp
  let displayMatches = matches ? [...matches] : [];
  if (liveOnly) {
    displayMatches = displayMatches.filter(m => m.status === "in" || m.status === "live");
  }
  if (liveFirst && !liveOnly) {
    displayMatches.sort((a, b) => {
      const aLive = a.status === "in" || a.status === "live" ? 0 : 1;
      const bLive = b.status === "in" || b.status === "live" ? 0 : 1;
      return aLive - bLive || a.timestamp - b.timestamp;
    });
  }

  const liveCount = matches ? matches.filter(m => m.status === "in" || m.status === "live").length : null;

  return (
    <section ref={sectionRef} className="mb-10 px-4 sm:px-6 lg:px-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase flex items-center gap-2 flex-wrap">
          <span className="border-l-4 border-red-600 pl-3">{emoji} {title}</span>
          {liveCount !== null && liveCount > 0 && (
            <span className="flex items-center gap-1 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              {liveCount} LIVE
            </span>
          )}
          {/* Only show total count if NOT a live-only section */}
          {!liveOnly && matches !== null && matches.length > 0 && liveCount !== matches.length && (
            <span className="text-zinc-600 text-xs font-normal normal-case">{matches.length} matches</span>
          )}
        </h2>
        {seeAllHref && (
          <Link href={seeAllHref} className="text-xs text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center gap-1 group">
            See All <ChevronRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>

      {/* ── SLIDER layout ── */}
      {layout === "slider" && (
        <div className="relative group -mx-4 sm:-mx-6 lg:-mx-10">
          <button onClick={() => scroll("left")} aria-label="Scroll left"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-[calc(100%-2rem)] bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent text-white flex items-center justify-start pl-2 sm:pl-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <ChevronLeft size={28} />
          </button>
          <button onClick={() => scroll("right")} aria-label="Scroll right"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-[calc(100%-2rem)] bg-gradient-to-l from-zinc-950 via-zinc-950/80 to-transparent text-white flex items-center justify-end pr-2 sm:pr-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <ChevronRight size={28} />
          </button>
          <div ref={rowRef} className="flex gap-3 overflow-x-auto scrollbar-hide pt-6 pb-8 px-4 sm:px-6 lg:px-10 -mt-6">
            {loading || matches === null
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonSportCard key={i} layout="slider" />)
              : displayMatches.map((match, idx) => <SportCard key={`${match.matchId}-${idx}`} match={match} />)
            }
          </div>
        </div>
      )}

      {/* ── GRID layout ── */}
      {layout === "grid" && (
        <div className={`grid gap-3 sm:gap-4 ${
          loading || matches === null || displayMatches.length === 0
            ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        }`}>
          {loading || matches === null
            ? Array.from({ length: 10 }).map((_, i) => <SkeletonSportCard key={i} layout="grid" />)
            : displayMatches.map((match, idx) => <SportCard key={`${match.matchId}-${idx}`} match={match} />)
          }
        </div>
      )}
    </section>
  );
}
