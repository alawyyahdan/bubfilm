"use client";
import { ServerCrash, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

interface ApiDownStateProps {
  provider: string;
}

export default function ApiDownState({ provider }: ApiDownStateProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
      <div className="w-24 h-24 bg-red-900/20 rounded-full flex items-center justify-center mb-6 ring-1 ring-red-500/30">
        <ServerCrash className="w-12 h-12 text-red-500" />
      </div>
      
      <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
        {provider} is Offline
      </h2>
      
      <p className="text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed">
        We're unable to fetch data from the <strong className="text-white">{provider}</strong> database right now. Their servers might be experiencing temporary stability issues or undergoing maintenance.
      </p>

      <button
        onClick={() => router.refresh()}
        className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/20 active:scale-95"
      >
        <RefreshCw size={18} /> Try Again
      </button>
    </div>
  );
}
