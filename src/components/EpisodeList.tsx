"use client";
import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { tmdbImg } from "@/lib/tmdb";

interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  runtime: number | null;
  air_date: string | null;
}

interface Season {
  season_number: number;
  name: string;
  episode_count: number;
}

interface EpisodeListProps {
  seasons: Season[];
  currentSeason: number;
  currentEpisode: number;
  episodes: Episode[];
  onSeasonChange: (season: number) => void;
  onEpisodeSelect: (episode: number) => void;
}

export default function EpisodeList({
  seasons,
  currentSeason,
  currentEpisode,
  episodes,
  onSeasonChange,
  onEpisodeSelect,
}: EpisodeListProps) {
  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden">
      {/* Season Selector */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
        <h3 className="text-white font-bold text-base">Episodes</h3>
        <select
          value={currentSeason}
          onChange={(e) => onSeasonChange(Number(e.target.value))}
          className="bg-zinc-800 text-white text-sm rounded-lg px-3 py-2 border border-zinc-700 focus:outline-none focus:border-red-600 cursor-pointer"
        >
          {seasons.map((s) => (
            <option key={s.season_number} value={s.season_number}>
              {s.name} ({s.episode_count} eps)
            </option>
          ))}
        </select>
      </div>

      {/* Episode List */}
      <div className="overflow-y-auto max-h-[500px] scrollbar-hide">
        {episodes.map((ep) => {
          const isActive = ep.episode_number === currentEpisode;
          return (
            <button
              key={ep.id}
              onClick={() => onEpisodeSelect(ep.episode_number)}
              className={`w-full flex items-start gap-3 p-3 hover:bg-zinc-800 transition-colors text-left ${
                isActive ? "episode-active" : ""
              }`}
            >
              {/* Thumbnail */}
              <div className="relative flex-shrink-0 w-24 h-14 rounded-md overflow-hidden bg-zinc-700">
                {ep.still_path ? (
                  <Image
                    src={tmdbImg(ep.still_path, "w300")}
                    alt={ep.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Play size={20} className="text-zinc-500" />
                  </div>
                )}
                {isActive && (
                  <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center">
                    <Play size={16} className="text-white" fill="white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold leading-tight line-clamp-1 ${isActive ? "text-red-400" : "text-white"}`}>
                  {ep.episode_number}. {ep.name}
                </p>
                {ep.runtime && (
                  <p className="text-xs text-gray-500 mt-0.5">{ep.runtime} min</p>
                )}
                {ep.overview && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-snug">{ep.overview}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
