"use client";
import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ContentCard from "./ContentCard";
import type { TMDBMedia } from "@/lib/tmdb";
import type { AniListMedia } from "@/lib/anilist";

interface ContentRowProps {
  title: string;
  seeAllHref?: string;
  items: (TMDBMedia | AniListMedia)[];
  type?: "movie" | "tv" | "anime";
}

export default function ContentRow({ title, seeAllHref, items, type }: ContentRowProps) {
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
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase">
          <span className="border-l-4 border-red-600 pl-3">{title}</span>
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

      {/* Scroll Container with fade edges */}
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

        {/* Right fade + arrow */}
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

        {/* Cards */}
        <div
          ref={rowRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide pt-6 pb-8 px-4 sm:px-6 lg:px-10 -mt-6"
        >
          {items.map((item, idx) => {
            const isAnime = "title" in item && typeof item.title === "object";
            const id = item.id;

            if (isAnime) {
              const a = item as AniListMedia;
              return (
                <ContentCard
                  key={`anime-${id}-${idx}`}
                  id={id}
                  title={a.title.english || a.title.romaji}
                  coverImage={a.coverImage.large}
                  voteAverage={a.averageScore ? a.averageScore / 10 : undefined}
                  year={String(a.seasonYear || "")}
                  type="anime"
                  priority={idx < 6}
                />
              );
            }

            const m = item as TMDBMedia;
            const mediaTitle = m.title || m.name || "";
            const mediaType = type || (m.media_type === "tv" ? "tv" : "movie");
            const year = (m.release_date || m.first_air_date || "").slice(0, 4);

            return (
              <ContentCard
                key={`${mediaType}-${id}-${idx}`}
                id={id}
                title={mediaTitle}
                posterPath={m.poster_path}
                voteAverage={m.vote_average}
                year={year}
                type={mediaType as "movie" | "tv"}
                priority={idx < 6}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
