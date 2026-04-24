"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Plus, Check, Star, Clock, Calendar, ChevronLeft } from "lucide-react";
import { tmdbImg, type TMDBMedia } from "@/lib/tmdb";
import ContentRow from "@/components/ContentRow";
import BannerAd from "@/components/BannerAd";
import ShareButton from "@/components/ShareButton";
import dynamic from "next/dynamic";

const VideoPlayer = dynamic(() => import("@/components/VideoPlayer"), { ssr: false });
const PopupAdModal = dynamic(() => import("@/components/PopupAdModal"), { ssr: false });

interface MovieDetailClientProps {
  movie: Record<string, unknown>;
}

export default function MovieDetailClient({ movie }: MovieDetailClientProps) {
  const [inList, setInList] = useState(() => {
    if (typeof window === "undefined") return false;
    const list = JSON.parse(localStorage.getItem("mylist") || "[]");
    return list.some((i: { id: number }) => i.id === movie?.id);
  });
  const [showPlayer, setShowPlayer] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  if (!movie) return null;

  const trailer = (movie.videos as { results?: any[] })?.results?.find(
    (v: any) => (v.type === "Trailer" || v.type === "Teaser") && v.site === "YouTube"
  );
  const videoKey = trailer?.key;

  useEffect(() => {
    if (videoKey) {
      const timer = setTimeout(() => setShowTrailer(true), 2500);
      return () => clearTimeout(timer);
    }
  }, [videoKey]);

  const toggleList = () => {
    const list = JSON.parse(localStorage.getItem("mylist") || "[]");
    if (inList) {
      localStorage.setItem("mylist", JSON.stringify(list.filter((i: { id: number }) => i.id !== movie.id)));
    } else {
      list.push({ id: movie.id, type: "movie", title: movie.title, poster_path: movie.poster_path });
      localStorage.setItem("mylist", JSON.stringify(list));
    }
    setInList(!inList);
  };

  const genres = (movie.genres as { id: number; name: string }[]) || [];
  const credits = (movie.credits as { cast: { id: number; name: string; profile_path: string | null; character: string }[] }) || { cast: [] };
  const similar = (movie.similar as { results: TMDBMedia[] }) || { results: [] };
  const runtime = (movie.runtime as number) || 0;
  const hours = Math.floor(runtime / 60);
  const mins = runtime % 60;
  const releaseYear = ((movie.release_date as string) || "").slice(0, 4);
  const rating = ((movie.vote_average as number) || 0).toFixed(1);

  return (
    <div className="min-h-screen bg-zinc-950">
      <PopupAdModal />
      {/* Backdrop */}
      <div className="relative h-[55vh] sm:h-[65vh] overflow-hidden">
        {movie.backdrop_path && (
          <Image
            src={tmdbImg(movie.backdrop_path as string, "original")}
            alt={movie.title as string}
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
        {/* Back */}
        <Link href="/movies" className="absolute top-20 left-6 flex items-center gap-2 text-gray-300 hover:text-white text-sm transition-colors z-20">
          <ChevronLeft size={18} /> Movies
        </Link>
      </div>

      {/* Content */}
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 -mt-32 relative z-10 pb-16">
        <div className="flex flex-col sm:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 w-44 sm:w-52 lg:w-60 mx-auto sm:mx-0">
            <div className="relative aspect-poster rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              {Boolean(movie.poster_path) && (
                <Image src={tmdbImg(movie.poster_path as string, "w500")} alt={movie.title as string} fill className="object-cover" sizes="240px" />
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-3">
              {movie.title as string}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-400">
              <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                <Star size={14} fill="currentColor" /> {rating}
              </span>
              <span className="flex items-center gap-1"><Calendar size={13} />{releaseYear}</span>
              {runtime > 0 && <span className="flex items-center gap-1"><Clock size={13} />{hours}h {mins}m</span>}
              <span className="text-xs border border-gray-600 px-1.5 py-0.5 rounded text-gray-400">HD</span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-5">
              {genres.map((g) => (
                <span key={g.id} className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-gray-300 border border-zinc-700">{g.name}</span>
              ))}
            </div>

            {/* Overview */}
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
              {movie.overview as string}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowPlayer(!showPlayer)}
                className="flex items-center gap-2 px-7 py-3 rounded-lg font-bold text-white text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: "#E50914" }}
              >
                <Play size={18} fill="white" />
                {showPlayer ? "Hide Player" : "Play Now"}
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
              <ShareButton />
            </div>
          </div>
        </div>

        <BannerAd location="detail" />

        {/* Player */}
        {showPlayer && (
          <VideoPlayer type="movie" id={movie.id as number} onClose={() => setShowPlayer(false)} />
        )}

        {/* Cast */}
        {credits.cast.length > 0 && (
          <div className="mt-12">
            <h2 className="text-white font-bold text-lg mb-4">Cast</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {credits.cast.slice(0, 12).map((actor) => (
                <div key={actor.id} className="flex-shrink-0 text-center w-20">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-800 mx-auto mb-2 ring-1 ring-zinc-700">
                    {actor.profile_path ? (
                      <Image src={tmdbImg(actor.profile_path, "w185")} alt={actor.name} width={64} height={64} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-500 text-lg font-bold">
                        {actor.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-white font-medium line-clamp-1">{actor.name}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar */}
        {similar.results.length > 0 && (
          <div className="mt-12">
            <ContentRow title="Similar Movies" items={similar.results as import("@/lib/tmdb").TMDBMedia[]} type="movie" />
          </div>
        )}
      </div>
    </div>
  );
}
