import Link from "next/link";
import { Film } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-center px-4">
      <Film size={80} className="text-red-600 mb-6" />
      <h1 className="text-7xl font-black text-white mb-2">404</h1>
      <h2 className="text-2xl font-bold text-gray-300 mb-3">Page Not Found</h2>
      <p className="text-gray-400 mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        href="/"
        className="px-8 py-3 rounded-lg font-bold text-white text-sm transition-all hover:opacity-90"
        style={{ background: "#E50914" }}
      >
        Back to Home
      </Link>
    </div>
  );
}
