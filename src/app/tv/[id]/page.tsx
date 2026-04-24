import { getTVDetails, getTVSeason } from "@/lib/tmdb";
import TVDetailClient from "@/components/TVDetailClient";
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
    const show = await getTVDetails(Number(id));
    return { title: `${show.name} - ${siteName}` };
  } catch {
    return { title: `TV Show - ${siteName}` };
  }
}

export default async function TVDetailPage({ params }: Props) {
  const { id } = await params;
  
  const tvId = Number(id);
  if (isNaN(tvId)) {
    notFound();
  }

  try {
    const [show, season1] = await Promise.all([
      getTVDetails(tvId),
      getTVSeason(tvId, 1),
    ]);
    
    if (!show) {
      notFound();
    }

    return <TVDetailClient show={show} initialSeason={season1} />;
  } catch {
    notFound();
  }
}
