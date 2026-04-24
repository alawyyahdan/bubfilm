"use client";
import { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2, GripVertical, Info } from "lucide-react";

interface Provider {
  id: string;
  name: string;
  enabled: boolean;
  movieUrl: string;
  tvUrl: string;
  animeUrl: string;
  note?: string;
}

export default function TabProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/providers")
      .then((r) => r.json())
      .then((d) => {
        setProviders(d);
        setLoading(false);
      });
  }, []);

  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    await fetch("/api/admin/providers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(providers),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const update = (idx: number, field: keyof Provider, value: any) => {
    const next = [...providers];
    next[idx] = { ...next[idx], [field]: value };
    setProviders(next);
  };

  const add = () => {
    setProviders([
      ...providers,
      { id: `server-${Date.now()}`, name: "New Server", enabled: true, movieUrl: "", tvUrl: "", animeUrl: "" }
    ]);
  };

  const remove = (idx: number) => {
    setProviders(providers.filter((_, i) => i !== idx));
  };

  const move = (idx: number, dir: -1 | 1) => {
    if (idx + dir < 0 || idx + dir >= providers.length) return;
    const next = [...providers];
    const temp = next[idx];
    next[idx] = next[idx + dir];
    next[idx + dir] = temp;
    setProviders(next);
  };

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-zinc-500" /></div>;

  return (
    <div className="max-w-4xl pb-20">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-white">Video Providers</h2>
          <p className="text-zinc-500 text-xs mt-0.5">Kelola server streaming player</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-emerald-500 text-xs font-bold animate-in fade-in slide-in-from-right-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Berhasil Disimpan!
            </span>
          )}
          <button onClick={save} disabled={saving} className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Simpan Semua
          </button>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6 flex gap-3 text-blue-400 text-xs">
        <Info size={16} className="shrink-0" />
        <div>
          <p className="font-bold mb-1">Cara penggunaan URL template:</p>
          <ul className="list-disc pl-4 space-y-1 text-zinc-400">
            <li>Gunakan <code>{`{tmdb}`}</code> untuk ID TMDB (Film / TV)</li>
            <li>Gunakan <code>{`{season}`}</code> untuk TV Season (default 1)</li>
            <li>Gunakan <code>{`{episode}`}</code> untuk TV / Anime Episode</li>
            <li>Gunakan <code>{`{anilist}`}</code> untuk AniList ID (khusus Anime)</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        {providers.map((p, idx) => (
          <div key={p.id} className="bg-zinc-900 border border-white/5 rounded-xl p-1 flex items-stretch">
            <div className="w-10 flex flex-col items-center justify-center border-r border-white/5 gap-2 text-zinc-600">
              <button onClick={() => move(idx, -1)} disabled={idx === 0} className="hover:text-white disabled:opacity-30"><GripVertical size={14} /></button>
              <span className="text-[10px] font-bold">{idx + 1}</span>
              <button onClick={() => move(idx, 1)} disabled={idx === providers.length - 1} className="hover:text-white disabled:opacity-30"><GripVertical size={14} /></button>
            </div>
            
            <div className="flex-1 p-4">
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="text-zinc-500 text-[10px] font-bold uppercase mb-1 block">Nama Server</label>
                  <input type="text" value={p.name} onChange={e => update(idx, "name", e.target.value)} className="w-full bg-zinc-950 border border-white/5 rounded p-2 text-xs text-white" />
                </div>
                <div className="w-24">
                  <label className="text-zinc-500 text-[10px] font-bold uppercase mb-1 block">ID Unik</label>
                  <input type="text" value={p.id} onChange={e => update(idx, "id", e.target.value)} className="w-full bg-zinc-950 border border-white/5 rounded p-2 text-xs text-white" />
                </div>
                <div className="w-20 pt-5 text-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={p.enabled} onChange={e => update(idx, "enabled", e.target.checked)} className="accent-red-500" />
                    <span className="text-xs text-zinc-400">Aktif</span>
                  </label>
                </div>
                <div className="w-10 pt-5">
                  <button onClick={() => remove(idx)} className="text-zinc-500 hover:text-red-500 p-1"><Trash2 size={16} /></button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-12 text-[10px] text-zinc-500 font-bold uppercase text-right shrink-0">Movie</span>
                  <input type="text" value={p.movieUrl} onChange={e => update(idx, "movieUrl", e.target.value)} placeholder="https://example.com/movie/{tmdb}" className="flex-1 bg-zinc-950 border border-white/5 rounded px-2 py-1.5 text-xs text-emerald-400 font-mono" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-12 text-[10px] text-zinc-500 font-bold uppercase text-right shrink-0">TV</span>
                  <input type="text" value={p.tvUrl} onChange={e => update(idx, "tvUrl", e.target.value)} placeholder="https://example.com/tv/{tmdb}/{season}/{episode}" className="flex-1 bg-zinc-950 border border-white/5 rounded px-2 py-1.5 text-xs text-blue-400 font-mono" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-12 text-[10px] text-zinc-500 font-bold uppercase text-right shrink-0">Anime</span>
                  <input type="text" value={p.animeUrl} onChange={e => update(idx, "animeUrl", e.target.value)} placeholder="https://example.com/anime/{anilist}/{episode}" className="flex-1 bg-zinc-950 border border-white/5 rounded px-2 py-1.5 text-xs text-purple-400 font-mono" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={add} className="mt-4 w-full border border-dashed border-white/10 text-zinc-500 hover:text-white hover:border-white/30 rounded-xl p-4 flex items-center justify-center gap-2 text-xs font-bold transition-colors">
        <Plus size={16} /> Tambah Provider Baru
      </button>
    </div>
  );
}
