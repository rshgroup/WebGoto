"use client";

import { SearchHeader } from "@/components/search-header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Play } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchVideos, type VideoResult } from "@/lib/search-service";
import { Button } from "@/components/ui/button";

export default function VideoSearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<VideoResult[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      if (!query) return;
      setLoading(true);
      try {
        const data = await searchVideos(query);
        setResults(data.items);
        setNextPageToken(data.nextPageToken);
      } catch (error) {
        console.error('Video search error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [query]);

  const loadMore = async () => {
    if (!nextPageToken) return;
    try {
      const data = await searchVideos(query, nextPageToken);
      setResults(prev => [...prev, ...data.items]);
      setNextPageToken(data.nextPageToken);
    } catch (error) {
      console.error('Load more videos error:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <SearchHeader />
      
      <main className="container max-w-6xl py-6">
        {loading ? (
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex gap-4">
                  <Skeleton className="h-48 w-72 shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-1/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {results.map((result) => (
                <Card key={result.id} className="p-4 hover:bg-muted/50">
                  <a
                    href={`https://www.youtube.com/watch?v=${result.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-4"
                  >
                    <div className="relative group">
                      <img
                        src={result.thumbnail}
                        alt={result.title}
                        className="h-48 w-72 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                      <span className="absolute bottom-2 right-2 bg-black/80 text-white text-sm px-2 py-1 rounded">
                        {result.duration}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{result.title}</h2>
                      <p className="text-sm text-muted-foreground mb-1">{result.channelTitle}</p>
                      <p className="text-sm text-muted-foreground">
                        {parseInt(result.viewCount).toLocaleString()} views • {result.publishedAt}
                      </p>
                    </div>
                  </a>
                </Card>
              ))}
            </div>

            {nextPageToken && (
              <div className="flex justify-center mt-8">
                <Button onClick={loadMore} variant="outline">
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}