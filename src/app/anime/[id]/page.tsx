import { getAnimeDetails } from "@/lib/anilist";
import AnimeDetailClient from "@/components/AnimeDetailClient";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

import { getSiteConfig } from "@/app/api/admin/site/route";

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const config = await getSiteConfig();
  const siteName = config.siteName || "Film";
  try {
    const anime = await getAnimeDetails(Number(id));
    return { title: `${anime.title.english || anime.title.romaji} - ${siteName}` };
  } catch {
    return { title: `Anime - ${siteName}` };
  }
}

import ApiDownState from "@/components/ApiDownState";

export default async function AnimeDetailPage({ params }: Props) {
  const { id } = await params;
  
  // 1. Validasi: Kalo ID bukan angka (NaN), langsung 404
  const animeId = Number(id);
  if (isNaN(animeId)) {
    notFound();
  }

  try {
    const anime = await getAnimeDetails(animeId);
    
    // 2. Kalo data anime null (nggak ketemu di AniList), render ApiDownState karena kemungkinan server tumbang
    if (!anime) {
      return (
        <div className="min-h-screen bg-zinc-950 pt-32 pb-16">
          <ApiDownState provider="AniList" />
        </div>
      );
    }

    return <AnimeDetailClient anime={anime} />;
  } catch (error) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-32 pb-16">
        <ApiDownState provider="AniList" />
      </div>
    );
  }
}
