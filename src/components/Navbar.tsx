"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, X, Menu } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/tv", label: "TV Shows" },
  { href: "/anime", label: "Anime" },
  { href: "/sports", label: "Sports", isSpecial: true },
  { href: "/mylist", label: "My List" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [siteConfig, setSiteConfig] = useState<any>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/admin/site")
      .then(res => res.json())
      .then(data => {
        if (Object.keys(data).length > 0) setSiteConfig(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [searchOpen]);

  // Close search on route change
  useEffect(() => { setSearchOpen(false); setMobileOpen(false); }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const closeSearch = () => { setSearchOpen(false); setSearchQuery(""); };

  return (
    <>
      {/* Search Overlay — full screen on mobile */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-zinc-950/95 backdrop-blur-sm flex flex-col items-center justify-start pt-24 px-4 sm:hidden animate-fade-in">
          <form onSubmit={handleSearch} className="w-full max-w-sm relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies, shows, anime..."
              className="w-full bg-zinc-800 text-white text-base rounded-xl pl-11 pr-12 py-4 border border-zinc-700 focus:border-red-600 outline-none"
            />
            <button
              type="button"
              onClick={closeSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </form>
          <p className="text-gray-500 text-sm mt-4">Press Enter to search</p>
        </div>
      )}

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || mobileOpen
            ? "bg-zinc-950/98 shadow-lg shadow-black/50 navbar-blur"
            : "bg-gradient-to-b from-black/80 to-transparent"
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 mr-4 flex items-center">
              {siteConfig?.logoType === "image" && siteConfig.logoImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={siteConfig.logoImageUrl || undefined} alt={siteConfig.siteName || "Logo"} className="h-8 w-auto object-contain" />
              ) : (
                <span className="text-2xl font-black tracking-wider text-red-600 hover:text-red-500 transition-colors">
                  {siteConfig?.logoText || "Film"}
                </span>
              )}
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 group ${
                    pathname === link.href 
                      ? link.isSpecial ? "text-red-500 font-bold" : "text-white" 
                      : link.isSpecial ? "text-red-600/80 hover:text-red-500" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {link.label}
                  {link.isSpecial && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                  )}
                  <span className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-300 ${
                    link.isSpecial ? "bg-red-500" : "bg-red-600"
                  } ${
                    pathname === link.href ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-100"
                  }`} />
                </Link>
              ))}
            </div>

            {/* Desktop Search */}
            <div className="hidden sm:flex items-center ml-auto">
              <div className={`flex items-center overflow-hidden transition-all duration-300 ${
                searchOpen ? "w-72 bg-zinc-800/90 rounded-xl border border-zinc-700 focus-within:border-red-600" : "w-9"
              }`}>
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="flex-shrink-0 p-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Search size={20} />
                </button>
                {searchOpen && (
                  <form onSubmit={handleSearch} className="flex items-center flex-1 pr-2">
                    <input
                      ref={searchRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="flex-1 bg-transparent text-white text-sm py-2 outline-none placeholder-gray-500 min-w-0"
                    />
                    {searchQuery && (
                      <button type="button" onClick={closeSearch} className="flex-shrink-0 text-gray-400 hover:text-white ml-1">
                        <X size={16} />
                      </button>
                    )}
                  </form>
                )}
              </div>
            </div>

            {/* Mobile Right: search + hamburger */}
            <div className="flex items-center gap-2 ml-auto sm:hidden">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-300 hover:text-white transition-colors"
              >
                <Search size={20} />
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 text-gray-300 hover:text-white transition-colors"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="border-t border-zinc-800 px-4 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors my-0.5 ${
                  pathname === link.href
                    ? link.isSpecial ? "text-red-500 bg-red-600/10 font-bold" : "text-white bg-zinc-800"
                    : link.isSpecial ? "text-red-500/80 hover:text-red-500 hover:bg-red-600/10" : "text-gray-300 hover:text-white hover:bg-zinc-800/50"
                }`}
              >
                {link.label}
                {link.isSpecial && (
                    <span className="ml-2 w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                )}
                {pathname === link.href && !link.isSpecial && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-600" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
