"use client";
import { useState, useEffect, useCallback } from "react";
import { RefreshCw, CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

type ServiceStatus = { name: string; status: "ok" | "warning" | "error" | "checking"; ms: number | null; code: number | null };

export default function TabHealth() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<string | null>(null);

  const check = useCallback(async () => {
    setLoading(true);
    setServices([
      { name: "TMDB API", status: "checking", ms: null, code: null },
      { name: "AniList GraphQL", status: "checking", ms: null, code: null },
      { name: "WatchFooty API", status: "checking", ms: null, code: null },
      { name: "Videasy Player", status: "checking", ms: null, code: null },
      { name: "VidLink", status: "checking", ms: null, code: null },
    ]);
    try {
      const res = await fetch("/api/admin/health");
      if (res.status === 401) { router.push("/ketua"); return; }
      const data = await res.json();
      setServices(data.services);
      setLastChecked(data.timestamp);
    } catch {
      setServices(prev => prev.map(s => ({ ...s, status: "error" as const })));
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { check(); }, [check]);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-white">API Health</h2>
          <p className="text-zinc-500 text-xs mt-0.5">Status semua layanan eksternal</p>
        </div>
        <button onClick={check} disabled={loading} className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 border border-white/5 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors">
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="space-y-2">
        {services.map((s) => (
          <div key={s.name} className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {s.status === "checking"
                ? <Loader2 size={18} className="text-zinc-500 animate-spin" />
                : s.status === "ok"
                ? <CheckCircle size={18} className="text-emerald-500" />
                : s.status === "warning"
                ? <AlertTriangle size={18} className="text-yellow-500" />
                : <XCircle size={18} className="text-red-500" />}
              <div>
                <p className="text-white text-sm font-medium">{s.name}</p>
                <p className="text-zinc-600 text-xs">
                  {s.status === "checking" ? "Checking..." : s.code ? `HTTP ${s.code}` : "Unreachable"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {s.ms != null && (
                <span className={`text-xs font-bold ${s.ms < 500 ? "text-emerald-400" : s.ms < 1500 ? "text-yellow-400" : "text-red-400"}`}>
                  {s.ms}ms
                </span>
              )}
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                s.status === "checking" ? "bg-zinc-800 text-zinc-500"
                : s.status === "ok" ? "bg-emerald-500/10 text-emerald-400"
                : s.status === "warning" ? "bg-yellow-500/10 text-yellow-400"
                : "bg-red-500/10 text-red-400"
              }`}>
                {s.status === "checking" ? "..." : s.status === "ok" ? "Online" : s.status === "warning" ? "Degraded" : "Offline"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {lastChecked && (
        <p className="text-zinc-700 text-[10px] mt-4">
          Last checked: {new Date(lastChecked).toLocaleString("id-ID")}
        </p>
      )}
    </div>
  );
}
