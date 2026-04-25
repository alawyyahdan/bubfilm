"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const sportsCategories = [
  { name: "All Sports", slug: "all", emoji: "🏆" },
  { name: "Live", slug: "live", emoji: "🔥" },
  { name: "Football", slug: "football", emoji: "⚽" },
  { name: "Basketball", slug: "basketball", emoji: "🏀" },
  { name: "Baseball", slug: "baseball", emoji: "⚾" },
  { name: "Hockey", slug: "hockey", emoji: "🏒" },
  { name: "Tennis", slug: "tennis", emoji: "🎾" },
  { name: "Rugby", slug: "rugby", emoji: "🏉" },
  { name: "Cricket", slug: "cricket", emoji: "🏏" },
  { name: "Am. Football", slug: "american-football", emoji: "🏈" },
  { name: "Volleyball", slug: "volleyball", emoji: "🏐" },
  { name: "Golf", slug: "golf", emoji: "⛳" },
  { name: "Fighting", slug: "fighting", emoji: "🥊" },
  { name: "Racing", slug: "racing", emoji: "🏎️" },
];

export default function SportFilter({ activeSport }: { activeSport?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const scroll = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group px-4 sm:px-6 lg:px-10 mb-8">
      {/* Scroll Left Button */}
      <button
        onClick={() => scroll(-300)}
        className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-zinc-900/90 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg border border-white/10 hidden sm:flex"
      >
        <ChevronLeft className="text-white w-5 h-5" />
      </button>

      {/* Categories Container */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-2 scroll-smooth"
      >
        {sportsCategories.map((sport) => {
          // Determine if this is the active route
          let isActive = false;
          if (sport.slug === "all") {
            isActive = pathname === "/sports" && !activeSport;
          } else {
            isActive = activeSport === sport.slug;
          }

          const href = sport.slug === "all" ? "/sports" : `/sports/${sport.slug}`;

          return (
            <Link
              key={sport.slug}
              href={href}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 border ${
                isActive
                  ? "bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                  : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700 hover:text-white"
              }`}
            >
              <span>{sport.emoji}</span>
              {sport.name}
            </Link>
          );
        })}
      </div>

      {/* Scroll Right Button */}
      <button
        onClick={() => scroll(300)}
        className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-zinc-900/90 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg border border-white/10 hidden sm:flex"
      >
        <ChevronRight className="text-white w-5 h-5" />
      </button>
      
      {/* Fading edges for scroll hint */}
      <div className="absolute top-0 right-4 sm:right-6 lg:right-10 bottom-0 w-12 bg-gradient-to-l from-zinc-950 to-transparent pointer-events-none sm:hidden" />
    </div>
  );
}
