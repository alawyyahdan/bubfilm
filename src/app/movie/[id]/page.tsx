import { getMovieDetails } from "@/lib/tmdb";
import MovieDetailClient from "@/components/MovieDetailClient";
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
    const movie = await getMovieDetails(Number(id));
    return { title: `${movie.title} - ${siteName}` };
  } catch {
    return { title: `Movie - ${siteName}` };
  }
}

import ApiDownState from "@/components/ApiDownState";

export default async function MovieDetailPage({ params }: Props) {
  const { id } = await params;
  
  const movieId = Number(id);
  if (isNaN(movieId)) {
    notFound();
  }

  try {
    const movie = await getMovieDetails(movieId);
    if (!movie) {
      return (
        <div className="min-h-screen bg-zinc-950 pt-32 pb-16">
          <ApiDownState provider="TMDB" />
        </div>
      );
    }
    return <MovieDetailClient movie={movie} />;
  } catch (error) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-32 pb-16">
        <ApiDownState provider="TMDB" />
      </div>
    );
  }
}
