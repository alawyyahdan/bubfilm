"use client";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import ContentCard from "@/components/ContentCard";
import SkeletonCard from "@/components/SkeletonCard";

interface InfiniteScrollGridProps {
  initialItems: any[];
  fetchAction: (page: number) => Promise<any>;
  type: "movie" | "tv" | "anime";
}

export default function InfiniteScrollGrid({ initialItems, fetchAction, type }: InfiniteScrollGridProps) {
  const [items, setItems] = useState<any[]>(initialItems);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    // Reset if initial items change (e.g. genre filter)
    setItems(initialItems);
    setPage(1);
    setHasMore(initialItems.length > 0);
  }, [initialItems]);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      const loadMore = async () => {
        const next = page + 1;
        setIsLoading(true);
        try {
          const newData = await fetchAction(next);
          const newItems = newData.results || newData || [];
          if (newItems.length === 0) {
            setHasMore(false);
          } else {
            setItems((prev) => [...prev, ...newItems]);
            setPage(next);
          }
        } catch {
          setHasMore(false);
        } finally {
          setIsLoading(false);
        }
      };
      loadMore();
    }
  }, [inView, hasMore, page, fetchAction, isLoading]);

  return (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
        {items.map((m, idx) => {
          const isAnime = type === "anime";
          return (
            <div key={`${m.id}-${idx}`} className="w-full">
              <ContentCard
                id={m.id}
                title={isAnime ? (m.title.english || m.title.romaji) : (m.title || m.name)}
                posterPath={m.poster_path}
                coverImage={isAnime ? m.coverImage?.large : undefined}
                voteAverage={isAnime ? (m.averageScore ? m.averageScore / 10 : undefined) : m.vote_average}
                year={isAnime ? String(m.seasonYear || "") : (m.release_date || m.first_air_date || "").slice(0, 4)}
                type={type}
                priority={idx < 10}
              />
            </div>
          );
        })}
      </div>
      
      {hasMore && (
        <div ref={ref} className="mt-8">
          {isLoading && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <SkeletonCard key={`skeleton-${i}`} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
