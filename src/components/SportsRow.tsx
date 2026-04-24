"use client";
import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SportCard from "./SportCard";
import { SportMatch } from "@/lib/sport";

export default function SportsRow({ title, items, seeAllHref }: {
  title: string;
  items: SportMatch[];
  seeAllHref?: string;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (rowRef.current) {
      const amount = rowRef.current.clientWidth * 0.75;
      rowRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    }
  };

  if (!items?.length) return null;

  return (
    <section className="mb-10 px-4 sm:px-6 lg:px-10">
      {/* Header — identical to ContentRow */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
          <span className="border-l-4 border-red-600 pl-3">{title}</span>
          <span className="flex items-center gap-1 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
          </span>
        </h2>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="relative z-[60] text-xs text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center gap-1 group"
          >
            See All
            <ChevronRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>

      {/* Scroll Container — identical to ContentRow */}
      <div className="relative group -mx-4 sm:-mx-6 lg:-mx-10">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20
            w-12 h-[calc(100%-2rem)]
            bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent
            text-white flex items-center justify-start pl-2 sm:pl-4
            opacity-0 group-hover:opacity-100
            transition-all duration-300"
        >
          <ChevronLeft size={28} />
        </button>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20
            w-12 h-[calc(100%-2rem)]
            bg-gradient-to-l from-zinc-950 via-zinc-950/80 to-transparent
            text-white flex items-center justify-end pr-2 sm:pr-4
            opacity-0 group-hover:opacity-100
            transition-all duration-300"
        >
          <ChevronRight size={28} />
        </button>

        {/* Cards — same padding/gap as ContentRow */}
        <div
          ref={rowRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide pt-6 pb-8 px-4 sm:px-6 lg:px-10 -mt-6"
        >
          {items.map((match, idx) => (
            <SportCard key={`${match.matchId}-${idx}`} match={match} />
          ))}
        </div>
      </div>
    </section>
  );
}
