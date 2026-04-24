"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Film } from "lucide-react";
import { tmdbImg } from "@/lib/tmdb";

interface ListItem {
  id: number;
  type: "movie" | "tv" | "anime";
  title: string;
  poster_path: string | null;
}

const badgeCfg = {
  movie: { label: "Movie", cls: "bg-red-600" },
  tv: { label: "TV", cls: "bg-blue-600" },
  anime: { label: "Anime", cls: "bg-purple-600" },
};

export default function MyListPage() {
  const [list, setList] = useState<ListItem[]>([]);

  useEffect(() => {
    setList(JSON.parse(localStorage.getItem("mylist") || "[]"));
  }, []);

  const remove = (id: number) => {
    const updated = list.filter((i) => i.id !== id);
    setList(updated);
    localStorage.setItem("mylist", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-20 pb-16">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-8">
        <div className="py-6">
          <h1 className="text-3xl font-black text-white mb-1">My List</h1>
          <p className="text-gray-400 text-sm">{list.length} saved title{list.length !== 1 ? "s" : ""}</p>
        </div>

        {list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Film size={64} className="text-zinc-700 mb-4" />
            <p className="text-white text-2xl font-bold mb-2">Your list is empty</p>
            <p className="text-gray-400 mb-6">Save movies, shows, and anime to watch later</p>
            <Link
              href="/"
              className="px-6 py-3 rounded-lg font-semibold text-white text-sm"
              style={{ background: "#E50914" }}
            >
              Browse Content
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {list.map((item) => {
              const href = item.type === "anime" ? `/anime/${item.id}` : `/${item.type}/${item.id}`;
              const badge = badgeCfg[item.type];
              const imgSrc = item.poster_path
                ? (item.poster_path.startsWith("http") ? item.poster_path : tmdbImg(item.poster_path, "w342"))
                : null;

              return (
                <div key={`${item.type}-${item.id}`} className="group relative">
                  <Link href={href}>
                    <div className="relative aspect-poster bg-zinc-800 rounded-lg overflow-hidden content-card">
                      <span className={`absolute top-2 left-2 z-10 text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${badge.cls}`}>
                        {badge.label}
                      </span>
                      {imgSrc && (
                        <Image src={imgSrc} alt={item.title} fill className="object-cover" sizes="160px" />
                      )}
                    </div>
                  </Link>
                  {/* Remove button */}
                  <button
                    onClick={() => remove(item.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white z-20"
                    aria-label="Remove from list"
                  >
                    <Trash2 size={13} />
                  </button>
                  <p className="mt-2 text-xs text-gray-300 line-clamp-2">{item.title}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
