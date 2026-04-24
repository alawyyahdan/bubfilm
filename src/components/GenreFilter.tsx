"use client";
import { useRouter, useSearchParams } from "next/navigation";

interface Genre { id: number; name: string; }

interface GenreFilterProps {
  genres: Genre[];
  type: "movie" | "tv";
}

export default function GenreFilter({ genres, type }: GenreFilterProps) {
  const router = useRouter();
  const params = useSearchParams();
  const activeGenre = params.get("genre");

  const handleGenre = (id: number | null) => {
    const base = type === "movie" ? "/movies" : "/tv";
    if (id) router.push(`${base}?genre=${id}`);
    else router.push(base);
  };

  return (
    <div className="px-6 sm:px-8 mb-4 flex flex-wrap gap-2">
      <button
        onClick={() => handleGenre(null)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
          !activeGenre
            ? "genre-pill-active border-red-600"
            : "bg-zinc-800 text-gray-300 border-zinc-700 hover:border-zinc-500 hover:text-white"
        }`}
      >
        All
      </button>
      {genres.map((g) => (
        <button
          key={g.id}
          onClick={() => handleGenre(g.id)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
            activeGenre === String(g.id)
              ? "genre-pill-active border-red-600"
              : "bg-zinc-800 text-gray-300 border-zinc-700 hover:border-zinc-500 hover:text-white"
          }`}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
}
