import { getMatchDetails, getLiveMatches } from "@/lib/sport";
import { getSiteConfig } from "@/app/api/admin/site/route";
import SportDetailClient from "@/components/SportDetailClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const config = getSiteConfig();
  const match = await getMatchDetails(id);
  if (!match?.title) return { title: `Match - ${config.siteName || "Sports"}` };
  return {
    title: `${match.title} - Live Stream | ${config.siteName}`,
    description: `Watch ${match.title} live stream.`,
    openGraph: {
      title: `${match.title} - Live Stream`,
      images: match.poster ? [{ url: match.poster }] : [],
    },
  };
}

export default async function SportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Primary: detail endpoint
  let match = await getMatchDetails(id);

  // Fallback: search in live list
  if (!match?.title) {
    const liveMatches = await getLiveMatches();
    match = liveMatches.find(m => m.matchId === id) || null;
  }

  if (!match?.title) return notFound();

  return <SportDetailClient match={match} />;
}
