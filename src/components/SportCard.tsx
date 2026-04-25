import Link from "next/link";
import Image from "next/image";
import { SportMatch } from "@/lib/sport";
import { Play } from "lucide-react";


export default function SportCard({ match }: { match: SportMatch }) {
  const isLive = match.status === "in" || match.status === "live";

  // Use poster as the card image directly (Next.js will optimize it via remotePatterns)
  const imgSrc = match.poster || null;

  return (
    <Link href={`/sport/${match.matchId}`} className="block flex-shrink-0 w-44 sm:w-52 lg:w-60 group">
      {/* Card — landscape 16:9 to show the poster correctly */}
      <div className="relative rounded-xl overflow-hidden bg-zinc-800 aspect-video cursor-pointer">

        {/* LIVE badge */}
        {isLive && (
          <span className="absolute top-2 left-2 z-10 flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white bg-red-600 leading-none shadow-lg">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
          </span>
        )}

        {/* Score badge */}
        {match.scores && isLive && (
          <span className="absolute top-2 right-2 z-10 text-[10px] font-black px-1.5 py-0.5 rounded-md text-white bg-black/70 leading-none">
            {match.scores.home}–{match.scores.away}
          </span>
        )}

        {/* Poster Image */}
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={match.title}
            fill sizes="(max-width: 640px) 176px, (max-width: 1024px) 208px, 240px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-700 p-3">
            <span className="text-zinc-400 text-xs text-center leading-snug">{match.title}</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <div className="flex items-center gap-1.5">
            <span className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow">
              <Play size={11} fill="black" className="text-black ml-0.5" />
            </span>
            <span className="text-white text-xs font-semibold">Watch</span>
          </div>
        </div>
      </div>

      {/* Title + Sport below card */}
      <div className="mt-2 px-0.5">
        <p className="text-xs text-gray-300 line-clamp-2 leading-snug group-hover:text-white transition-colors duration-200">
          {match.title}
        </p>
        <p className="text-xs text-zinc-500 mt-0.5 capitalize">
          {match.league || match.sport} · {new Date(match.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </Link>
  );
}
