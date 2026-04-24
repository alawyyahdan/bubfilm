"use client";
import Image from "next/image";
import Link from "next/link";
import { Play, Star } from "lucide-react";
import { tmdbImg } from "@/lib/tmdb";

interface ContentCardProps {
  id: number;
  title: string;
  posterPath?: string | null;
  coverImage?: string;
  voteAverage?: number;
  year?: string;
  type: "movie" | "tv" | "anime";
  priority?: boolean;
}

const badgeConfig = {
  movie: { label: "Movie", bg: "bg-red-600" },
  tv:    { label: "TV",    bg: "bg-blue-600" },
  anime: { label: "Anime", bg: "bg-purple-600" },
};

export default function ContentCard({
  id, title, posterPath, coverImage, voteAverage, year, type, priority,
}: ContentCardProps) {
  const badge = badgeConfig[type];
  const href = type === "anime" ? `/anime/${id}` : `/${type}/${id}`;
  const imgSrc = coverImage || (posterPath ? tmdbImg(posterPath, "w342") : null);

  return (
    <Link href={href} className="block flex-shrink-0 w-36 sm:w-40 lg:w-44 group">
      {/* Card */}
      <div className="content-card relative rounded-xl overflow-hidden bg-zinc-800 aspect-poster cursor-pointer">
        {/* Type Badge */}
        <span
          className={`absolute top-2 left-2 z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white leading-none ${badge.bg}`}
        >
          {badge.label}
        </span>

        {/* Poster Image */}
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 144px, (max-width: 1024px) 160px, 176px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-700">
            <span className="text-zinc-400 text-xs text-center px-2 leading-snug">{title}</span>
          </div>
        )}

        {/* Hover overlay with info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
          <div className="w-full">
            {voteAverage && voteAverage > 0 && (
              <div className="flex items-center gap-1 text-yellow-400 text-xs font-semibold">
                <Star size={10} fill="currentColor" />
                <span>{voteAverage.toFixed(1)}</span>
              </div>
            )}
            <div className="mt-1 flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
                <Play size={10} fill="black" className="text-black ml-0.5" />
              </span>
              <span className="text-white text-xs font-semibold">Play</span>
            </div>
          </div>
        </div>
      </div>

      {/* Title + Year below card */}
      <div className="mt-2 px-0.5">
        <p className="text-xs text-gray-300 line-clamp-2 leading-snug group-hover:text-white transition-colors duration-200">
          {title}
        </p>
        {year && <p className="text-xs text-zinc-500 mt-0.5">{year}</p>}
      </div>
    </Link>
  );
}
