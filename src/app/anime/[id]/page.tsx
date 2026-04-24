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

export default async function AnimeDetailPage({ params }: Props) {
  const { id } = await params;
  
  // 1. Validasi: Kalo ID bukan angka (NaN), langsung 404
  const animeId = Number(id);
  if (isNaN(animeId)) {
    notFound();
  }

  try {
    const anime = await getAnimeDetails(animeId);
    
    // 2. Kalo data anime null (nggak ketemu di AniList), langsung 404
    if (!anime) {
      notFound();
    }

    return <AnimeDetailClient anime={anime} />;
  } catch {
    notFound();
  }
}
