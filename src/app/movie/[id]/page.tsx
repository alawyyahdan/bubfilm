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

export default async function MovieDetailPage({ params }: Props) {
  const { id } = await params;
  
  const movieId = Number(id);
  if (isNaN(movieId)) {
    notFound();
  }

  try {
    const movie = await getMovieDetails(movieId);
    if (!movie) {
      notFound();
    }
    return <MovieDetailClient movie={movie} />;
  } catch {
    notFound();
  }
}
