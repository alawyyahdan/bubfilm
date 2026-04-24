"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Plus, Check, Star, ChevronLeft, Tv } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import ContentCard from "@/components/ContentCard";
import PopupAdModal from "@/components/PopupAdModal";
import BannerAd from "@/components/BannerAd";
import type { AniListMedia } from "@/lib/anilist";

interface AnimeDetailClientProps {
  anime: AniListMedia & {
    characters?: { nodes: { id: number; name: { full: string }; image: { large: string } }[] };
    recommendations?: { nodes: { mediaRecommendation: { id: number; title: { romaji: string }; coverImage: { large: string }; format: string; averageScore: number; seasonYear: number } }[] };
  };
}

export default function AnimeDetailClient({ anime }: AnimeDetailClientProps) {
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  if (!anime) return null;

  const videoKey = anime?.trailer?.site === "youtube" ? anime.trailer.id : null;

  useEffect(() => {
    if (videoKey) {
      const timer = setTimeout(() => setShowTrailer(true), 2500);
      return () => clearTimeout(timer);
    }
  }, [videoKey]);

  const [inList, setInList] = useState(() => {
    if (typeof window === "undefined") return false;
    const list = JSON.parse(localStorage.getItem("mylist") || "[]");
    return list.some((i: { id: number }) => i.id === anime.id);
  });

  const title = anime.title.english || anime.title.romaji;
  const totalEps = anime.episodes || 1;
  const score = anime.averageScore ? (anime.averageScore / 10).toFixed(1) : "N/A";
  const description = anime.description?.replace(/<[^>]*>/g, "") || "";
  const isMovie = anime.format === "MOVIE";

  const toggleList = () => {
    const list = JSON.parse(localStorage.getItem("mylist") || "[]");
    if (inList) {
      localStorage.setItem("mylist", JSON.stringify(list.filter((i: { id: number }) => i.id !== anime.id)));
    } else {
      list.push({ id: anime.id, type: "anime", title, poster_path: anime.coverImage.large });
      localStorage.setItem("mylist", JSON.stringify(list));
    }
    setInList(!inList);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <PopupAdModal />
      {/* Backdrop */}
      <div className="relative h-[55vh] sm:h-[60vh] overflow-hidden">
        {(anime.bannerImage || anime.coverImage.extraLarge) && (
          <Image
            src={anime.bannerImage || anime.coverImage.extraLarge}
            alt={title}
            fill className={`object-cover object-top transition-opacity duration-1000 ${showTrailer ? "opacity-0" : "opacity-100"}`}
            priority sizes="100vw"
          />
        )}

        {showTrailer && videoKey && (
          <div className="absolute inset-0 overflow-hidden animate-fade-in pointer-events-none">
            <iframe
              className="absolute w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&modestbranding=1&playlist=${videoKey}&iv_load_policy=3&disablekb=1`}
              allow="autoplay; encrypted-media"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 to-transparent z-10" />
        <Link href="/anime" className="absolute top-20 left-6 flex items-center gap-2 text-gray-300 hover:text-white text-sm transition-colors z-20">
          <ChevronLeft size={18} /> Anime
        </Link>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 -mt-32 relative z-10 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-8 mb-10">
          {/* Cover */}
          <div className="flex-shrink-0 w-44 sm:w-52 lg:w-60 mx-auto sm:mx-0">
            <div className="relative aspect-poster rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <Image src={anime.coverImage.extraLarge} alt={title} fill className="object-cover" sizes="240px" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-600 text-white">ANIME</span>
              <span className="text-xs text-gray-400">{anime.format}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-1">{title}</h1>
            {anime.title.native && (
              <p className="text-gray-500 text-sm mb-3">{anime.title.native}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-400">
              {score !== "N/A" && (
                <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                  <Star size={14} fill="currentColor" /> {score}
                </span>
              )}
              {anime.seasonYear && <span>{anime.seasonYear}</span>}
              {!isMovie && totalEps > 0 && (
                <span className="flex items-center gap-1"><Tv size={13} />{totalEps} Episodes</span>
              )}
              {anime.status && (
                <span className={`text-xs px-2 py-0.5 rounded border ${
                  anime.status === "FINISHED" ? "border-green-700 text-green-400" :
                  anime.status === "RELEASING" ? "border-blue-700 text-blue-400" :
                  "border-zinc-700 text-gray-400"
                }`}>
                  {anime.status.replace("_", " ")}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              {anime.genres.map((g) => (
                <span key={g} className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-gray-300 border border-zinc-700">{g}</span>
              ))}
            </div>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl line-clamp-3">{description}</p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowPlayer(!showPlayer)}
                className="flex items-center gap-2 px-7 py-3 rounded-lg font-bold text-white text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: "#E50914" }}
              >
                <Play size={18} fill="white" />
                {showPlayer ? "Hide Player" : isMovie ? "Play Movie" : `Play Ep ${currentEpisode}`}
              </button>
              <button
                onClick={toggleList}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm transition-all border ${
                  inList ? "bg-green-600/20 border-green-600 text-green-400" : "bg-zinc-800 border-zinc-700 text-gray-300 hover:border-zinc-500"
                }`}
              >
                {inList ? <Check size={16} /> : <Plus size={16} />}
                {inList ? "In My List" : "My List"}
              </button>
            </div>
          </div>
        </div>

        <BannerAd location="detail" />

        {/* Player */}
        {showPlayer && (
          <VideoPlayer
            type="anime"
            id={anime.id}
            malId={anime.idMal}
            episode={currentEpisode}
            onClose={() => setShowPlayer(false)}
          />
        )}

        {/* Episode Selector (non-movie) */}
        {!isMovie && totalEps > 1 && (
          <div className="mb-12">
            <h2 className="text-white font-bold text-lg mb-4">Episodes</h2>
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
              {Array.from({ length: totalEps }, (_, i) => i + 1).map((ep) => (
                <button
                  key={ep}
                  onClick={() => { setCurrentEpisode(ep); setShowPlayer(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className={`py-2 rounded-lg text-sm font-semibold transition-all border ${
                    currentEpisode === ep
                      ? "bg-red-600 border-red-600 text-white"
                      : "bg-zinc-800 border-zinc-700 text-gray-300 hover:border-red-600 hover:text-white"
                  }`}
                >
                  {ep}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Characters */}
        {(anime.characters?.nodes?.length ?? 0) > 0 && (
          <div className="mb-12">
            <h2 className="text-white font-bold text-lg mb-4">Main Characters</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {(anime.characters?.nodes ?? []).slice(0, 12).map((char) => (
                <div key={char.id} className="flex-shrink-0 text-center w-20">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-800 mx-auto mb-2 ring-1 ring-zinc-700">
                    <Image src={char.image.large} alt={char.name.full} width={64} height={64} className="object-cover w-full h-full" />
                  </div>
                  <p className="text-xs text-white font-medium line-clamp-2 leading-tight">{char.name.full}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {(anime.recommendations?.nodes?.length ?? 0) > 0 && (
          <div className="mt-12">
            <h2 className="text-white font-bold text-lg mb-4 border-l-4 border-red-600 pl-3">Recommendations</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
              {(anime.recommendations?.nodes ?? [])
                .map((r) => r.mediaRecommendation)
                .filter(Boolean)
                .filter((r) => r.format !== "MANGA" && r.format !== "NOVEL" && r.format !== "ONE_SHOT")
                .map((rel) => (
                <div key={`rec-${rel.id}`} className="w-full">
                  <ContentCard
                    id={rel.id}
                    title={rel.title.romaji}
                    coverImage={rel.coverImage.large}
                    voteAverage={rel.averageScore ? rel.averageScore / 10 : undefined}
                    year={String(rel.seasonYear || "")}
                    type="anime"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
