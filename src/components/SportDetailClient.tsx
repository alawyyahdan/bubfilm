"use client";
import { useState, useEffect } from "react";
import { SportMatch } from "@/lib/sport";
import { Play, ChevronDown, ShieldAlert, Trophy, Clock, MapPin } from "lucide-react";
import PopupAdModal from "@/components/PopupAdModal";
import BannerAd from "@/components/BannerAd";
import { SportPlayerAds, SportSidebarAds } from "@/components/SportAdBlock";
import SportChat from "./SportChat";

const proxyImg = (url: string) =>
  url ? `/api/img-proxy?src=${encodeURIComponent(url)}` : "";

export default function SportDetailClient({ match }: { match: SportMatch }) {
  const [selectedStream, setSelectedStream] = useState(match.streams?.[0] || null);

  useEffect(() => {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: `/sport/${match.matchId}` }),
    }).catch(() => {});
  }, [match.matchId]);

  const isLive = match.status === "in" || match.status === "live";
  const isFinished = match.status === "finished" || match.status === "end" || match.status === "post";

  return (
    <div className="min-h-screen bg-zinc-950 pb-20 pt-20">
      <PopupAdModal />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Top Banner Ad */}
        <BannerAd location="detail" rowIndex={0} />

        {/* Match Title Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-4 mt-4">
          {/* League badge */}
          <span className="inline-flex items-center gap-1.5 bg-zinc-800 border border-white/5 text-zinc-300 text-xs font-bold uppercase px-3 py-1 rounded-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {match.leagueLogo && <img src={proxyImg(match.leagueLogo)} alt="" className="h-4 w-4 object-contain" />}
            {match.league || match.sport}
          </span>
          {isLive && (
            <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-black uppercase px-3 py-1 rounded-full shadow-[0_0_12px_rgba(220,38,38,0.6)] animate-pulse">
              <span className="w-1.5 h-1.5 bg-white rounded-full" /> LIVE
            </span>
          )}
          {isFinished && (
            <span className="inline-flex items-center gap-2 bg-zinc-700 text-zinc-300 text-xs font-bold uppercase px-3 py-1 rounded-full">
              Finished
            </span>
          )}
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-5">{match.title}</h1>

        {/* Main Grid: Player (left/top) + Sidebar (right) */}
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">
          
          {/* LEFT: Player + Score + Stream Selector */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* Live Score Bar (above player) */}
            {(match.scores || match.currentMinute) && (
              <div className="flex items-center justify-center gap-6 bg-zinc-900 border border-white/5 rounded-xl px-6 py-4">
                <div className="flex items-center gap-3 flex-1 justify-end">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {match.teams?.home?.logoUrl && <img src={proxyImg(match.teams.home.logoUrl)} alt={match.teams.home.name} className="h-8 w-8 object-contain" />}
                  <span className="text-white text-sm font-bold hidden sm:block">{match.teams?.home?.name}</span>
                </div>
                <div className="flex flex-col items-center">
                  {match.scores ? (
                    <span className="text-white text-2xl font-black">{match.scores.home} – {match.scores.away}</span>
                  ) : (
                    <span className="text-zinc-500 text-lg font-black">VS</span>
                  )}
                  {match.currentMinute && (
                    <span className="text-red-400 text-xs font-bold mt-0.5">{match.currentMinute}'</span>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-1 justify-start">
                  <span className="text-white text-sm font-bold hidden sm:block">{match.teams?.away?.name}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {match.teams?.away?.logoUrl && <img src={proxyImg(match.teams.away.logoUrl)} alt={match.teams.away.name} className="h-8 w-8 object-contain" />}
                </div>
              </div>
            )}

            {/* Stream Selector */}
            {match.streams && match.streams.length > 1 && (
              <div className="flex flex-wrap items-center gap-2 bg-zinc-900/60 p-3 rounded-xl border border-white/5">
                <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mr-1">Source:</span>
                {match.streams.map((stream, idx) => (
                  <button
                    key={stream.id}
                    onClick={() => setSelectedStream(stream)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                      selectedStream?.id === stream.id
                        ? "bg-red-600 text-white"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                    }`}
                  >
                    <Play size={9} className={selectedStream?.id === stream.id ? "fill-white" : "fill-zinc-400"} />
                    Server {idx + 1}
                    {stream.quality && <span className="opacity-60 text-[10px] uppercase">{stream.quality}</span>}
                  </button>
                ))}
              </div>
            )}

            {/* Video Player */}
            <div className="w-full aspect-video bg-zinc-900 rounded-xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
              {selectedStream ? (
                <iframe
                  key={selectedStream.id}
                  src={selectedStream.url}
                  className="w-full h-full border-0"
                  allowFullScreen
                  allow="autoplay; fullscreen; picture-in-picture"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
                  <ShieldAlert size={40} className="text-zinc-700 mb-3" />
                  <p className="text-zinc-500 text-sm font-medium">No stream available for this match.</p>
                </div>
              )}
            </div>

            {/* Sport-specific ad zone below player:
                [728x90 banner top]
                [300x300][300x300]
                [300x300][300x300]
                [728x90 banner bottom] */}
            <SportPlayerAds />
          </div>

          {/* RIGHT SIDEBAR: Match Details */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col gap-4">
            
            {/* Team Matchup Card */}
            <div className="bg-zinc-900 border border-white/5 rounded-xl p-5">
              <h2 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-5 flex items-center gap-2">
                <Trophy size={12} className="text-yellow-500" /> Match Info
              </h2>

              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col items-center flex-1 gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {match.teams?.home?.logoUrl && (
                    <img src={proxyImg(match.teams.home.logoUrl)} alt={match.teams.home.name} className="h-14 w-14 object-contain drop-shadow-lg" />
                  )}
                  <p className="text-white text-xs font-bold text-center leading-tight">{match.teams?.home?.name || "Home"}</p>
                </div>

                <div className="flex flex-col items-center text-center">
                  {match.scores ? (
                    <span className="text-white text-2xl font-black">{match.scores.home}–{match.scores.away}</span>
                  ) : (
                    <span className="text-zinc-600 font-black text-sm">VS</span>
                  )}
                  {match.currentMinute && (
                    <span className="text-red-500 text-[10px] font-bold mt-1 animate-pulse">{match.currentMinute}'</span>
                  )}
                </div>

                <div className="flex flex-col items-center flex-1 gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {match.teams?.away?.logoUrl && (
                    <img src={proxyImg(match.teams.away.logoUrl)} alt={match.teams.away.name} className="h-14 w-14 object-contain drop-shadow-lg" />
                  )}
                  <p className="text-white text-xs font-bold text-center leading-tight">{match.teams?.away?.name || "Away"}</p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/5 space-y-2.5 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <Clock size={13} className="text-zinc-600 flex-shrink-0" />
                  <span>{new Date(match.date).toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center gap-2 capitalize">
                  <Trophy size={13} className="text-zinc-600 flex-shrink-0" />
                  <span>{match.league || match.sport}</span>
                </div>
                <div className="flex items-center gap-2 capitalize">
                  <MapPin size={13} className="text-zinc-600 flex-shrink-0" />
                  <span className="capitalize">{match.sport}</span>
                </div>
              </div>
            </div>

            {/* LIVE CHAT - Embedded below match details */}
            <SportChat />

            {/* Sticky Sidebar Ads for PC */}
            <div className="lg:sticky lg:top-24 space-y-4">
              <SportSidebarAds />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
