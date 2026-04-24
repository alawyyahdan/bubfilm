"use client";
import { useState, useEffect, useCallback } from "react";
import { TrendingUp, Eye, FileText, Calendar, Server, Cpu, HardDrive, Clock, Activity } from "lucide-react";

type Analytics = {
  totalPageViews: number;
  pages: Record<string, number>;
  dailyViews: Record<string, number>;
  lastUpdated: string;
};

type SystemInfo = {
  memory: { total: string; used: string; percent: number };
  cpu: { model: string; cores: number; usagePercent: number };
  uptime: string;
  nodeVersion: string;
  platform: string;
  timestamp: string;
};

export default function TabAnalytics() {
  const [data, setData] = useState<Analytics | null>(null);
  const [sys, setSys] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [resAnalytic, resSys] = await Promise.all([
        fetch("/api/analytics/track"),
        fetch("/api/admin/system")
      ]);
      if (resAnalytic.ok) setData(await resAnalytic.json());
      if (resSys.ok) setSys(await resSys.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const topPages = data ? Object.entries(data.pages).sort(([, a], [, b]) => b - a).slice(0, 10) : [];
  const last7Days = data ? Object.entries(data.dailyViews)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7) : [];
  const maxDaily = last7Days.length > 0 ? Math.max(...last7Days.map(([, v]) => v)) : 1;

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h2 className="text-base font-bold text-white">Analytics</h2>
        <p className="text-zinc-500 text-xs mt-0.5">Statistik pengunjung situs</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Total Page Views", value: data?.totalPageViews ?? 0, icon: Eye, color: "text-blue-400" },
          { label: "Halaman Unik", value: data ? Object.keys(data.pages).length : 0, icon: FileText, color: "text-purple-400" },
          { label: "Hari Aktif", value: data ? Object.keys(data.dailyViews).length : 0, icon: Calendar, color: "text-emerald-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-zinc-900 border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={14} className={color} />
              <span className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wide">{label}</span>
            </div>
            <p className="text-2xl font-black text-white">{loading ? "—" : value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Server Health */}
      <div className="bg-zinc-900 border border-white/5 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Server size={14} className="text-blue-400" />
            <p className="text-zinc-300 text-xs font-bold uppercase tracking-wider">Server Resources & Health</p>
          </div>
          {sys && (
            <span className="text-[10px] text-zinc-500 flex items-center gap-1">
              <Activity size={10} className="text-emerald-500 animate-pulse" />
              Live &bull; Node {sys.nodeVersion}
            </span>
          )}
        </div>
        
        {loading || !sys ? (
          <p className="text-zinc-600 text-sm text-center py-6">Memuat data server...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* CPU */}
            <div className="bg-zinc-950/50 border border-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Cpu size={14} />
                  <span className="text-xs font-semibold">CPU Usage</span>
                </div>
                <span className="text-xs font-bold text-white">{sys.cpu.usagePercent}%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-1.5 mb-1.5">
                <div className={`h-full rounded-full ${sys.cpu.usagePercent > 80 ? 'bg-red-500' : sys.cpu.usagePercent > 50 ? 'bg-yellow-500' : 'bg-emerald-500'}`} style={{ width: `${sys.cpu.usagePercent}%` }} />
              </div>
              <p className="text-[9px] text-zinc-500 truncate" title={sys.cpu.model}>{sys.cpu.cores} Cores &bull; {sys.cpu.model}</p>
            </div>

            {/* RAM */}
            <div className="bg-zinc-950/50 border border-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <HardDrive size={14} />
                  <span className="text-xs font-semibold">Memory</span>
                </div>
                <span className="text-xs font-bold text-white">{sys.memory.percent}%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-1.5 mb-1.5">
                <div className={`h-full rounded-full ${sys.memory.percent > 80 ? 'bg-red-500' : sys.memory.percent > 50 ? 'bg-yellow-500' : 'bg-blue-500'}`} style={{ width: `${sys.memory.percent}%` }} />
              </div>
              <p className="text-[9px] text-zinc-500">{sys.memory.used} / {sys.memory.total}</p>
            </div>

            {/* Uptime */}
            <div className="bg-zinc-950/50 border border-white/5 rounded-lg p-4 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                <Clock size={14} />
                <span className="text-xs font-semibold">Uptime</span>
              </div>
              <p className="text-lg font-bold text-white">{sys.uptime}</p>
              <p className="text-[9px] text-zinc-500 mt-1 truncate">Platform: {sys.platform}</p>
            </div>
          </div>
        )}
      </div>

      {/* Daily bar chart */}
      <div className="bg-zinc-900 border border-white/5 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={14} className="text-red-500" />
          <p className="text-zinc-300 text-xs font-bold uppercase tracking-wider">7 Hari Terakhir</p>
        </div>
        {last7Days.length === 0 ? (
          <p className="text-zinc-600 text-sm text-center py-6">Belum ada data</p>
        ) : (
          <div className="flex items-end gap-2 h-28">
            {last7Days.map(([date, count]) => (
              <div key={date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] text-zinc-500 font-bold">{count}</span>
                <div
                  className="w-full bg-red-600 rounded-t-sm transition-all"
                  style={{ height: `${Math.max(4, (count / maxDaily) * 100)}%` }}
                />
                <span className="text-[9px] text-zinc-600 rotate-45 origin-left ml-1 whitespace-nowrap">
                  {date.slice(5)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top pages */}
      <div className="bg-zinc-900 border border-white/5 rounded-xl p-5">
        <p className="text-zinc-300 text-xs font-bold uppercase tracking-wider mb-3">Top Pages</p>
        {topPages.length === 0 ? (
          <p className="text-zinc-600 text-sm text-center py-6">Belum ada data</p>
        ) : (
          <div className="space-y-2">
            {topPages.map(([page, count]) => {
              const pct = Math.round((count / (data?.totalPageViews || 1)) * 100);
              return (
                <div key={page} className="flex items-center gap-3">
                  <span className="text-zinc-400 text-xs font-mono w-28 truncate shrink-0">{page}</span>
                  <div className="flex-1 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-red-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-zinc-400 text-xs w-8 text-right shrink-0">{count}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="text-center pb-8 pt-4">
        <p className="text-[10px] text-zinc-500">
          Last Check: {sys?.timestamp ? new Date(sys.timestamp).toLocaleString() : "Loading..."}
        </p>
      </div>
    </div>
  );
}
