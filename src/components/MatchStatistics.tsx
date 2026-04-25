"use client";
import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

interface StatItem {
  displayValue: string;
  label: string;
  percentage: number;
  name: string;
}

interface MatchStatsResponse {
  statistics?: {
    boxscore?: {
      teams?: [
        { team: { displayName: string; logoId: string }; statistics: StatItem[] },
        { team: { displayName: string; logoId: string }; statistics: StatItem[] }
      ];
    };
  };
}

export default function MatchStatistics({ matchId }: { matchId: string }) {
  const [stats, setStats] = useState<MatchStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchStats = async () => {
      try {
        const res = await fetch(`https://api.watchfooty.st/api/v1/match/${matchId}/stats`);
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted) {
          setStats(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch match statistics", err);
      }
    };

    fetchStats();
    // Poll every 10 seconds
    const interval = setInterval(fetchStats, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [matchId]);

  if (loading) {
    return (
      <div className="w-full bg-zinc-900 border border-white/5 rounded-xl p-5 mt-6 animate-pulse">
        <div className="h-4 w-32 bg-zinc-800 rounded mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-3 w-8 bg-zinc-800 rounded"></div>
              <div className="h-2 w-full mx-4 bg-zinc-800 rounded"></div>
              <div className="h-3 w-8 bg-zinc-800 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const teams = stats?.statistics?.boxscore?.teams;
  if (!teams || teams.length !== 2) return null;

  const homeStats = teams[0].statistics;
  const awayStats = teams[1].statistics;

  // We assume both teams have the same stat labels in the same order
  return (
    <div className="w-full bg-zinc-900 border border-white/5 rounded-xl p-5 sm:p-6 mt-6">
      <h3 className="text-white font-bold mb-6 flex items-center gap-2">
        <Activity size={18} className="text-red-500" /> Match Statistics
        <span className="text-[10px] bg-red-600/20 text-red-500 px-2 py-0.5 rounded ml-auto flex items-center gap-1.5 uppercase font-bold tracking-wider">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> Live
        </span>
      </h3>

      <div className="flex justify-between items-end mb-4 text-xs font-bold text-zinc-400">
        <div className="w-20 truncate">{teams[0].team.displayName}</div>
        <div className="text-[10px] uppercase tracking-widest opacity-50">vs</div>
        <div className="w-20 truncate text-right">{teams[1].team.displayName}</div>
      </div>

      <div className="space-y-5">
        {homeStats.map((homeStat, i) => {
          const awayStat = awayStats.find(s => s.name === homeStat.name) || { displayValue: "0", percentage: 0 };
          
          // Calculate relative widths for the dual progress bar
          let homeWidth = homeStat.percentage * 100;
          let awayWidth = awayStat.percentage * 100;
          
          // If the API returns percentages that don't add up to 100 (e.g. Total Shots), we normalize them
          const sum = homeWidth + awayWidth;
          if (sum > 0 && homeStat.name !== "Possession") {
            homeWidth = (homeWidth / sum) * 100;
            awayWidth = (awayWidth / sum) * 100;
          }

          // Special logic for Possession so it takes full 100% width cleanly
          if (homeStat.name === "Possession") {
            // Usually possession is e.g. 0.63 and 0.37
            homeWidth = homeStat.percentage * 100;
            awayWidth = 100 - homeWidth;
          }

          return (
            <div key={homeStat.name} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-white">{homeStat.displayValue}</span>
                <span className="text-zinc-500 uppercase tracking-wider text-[10px]">{homeStat.label}</span>
                <span className="font-bold text-white">{awayStat.displayValue}</span>
              </div>
              
              <div className="flex h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="bg-red-600 transition-all duration-1000 ease-out" 
                  style={{ width: `${homeWidth}%` }} 
                />
                <div 
                  className="bg-blue-600 ml-auto transition-all duration-1000 ease-out" 
                  style={{ width: `${awayWidth}%` }} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
