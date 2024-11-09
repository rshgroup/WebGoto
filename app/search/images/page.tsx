"use client";

import { SearchHeader } from "@/components/search-header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchImages, type SearchResult } from "@/lib/search-service";
import { Button } from "@/components/ui/button";

export default function ImageSearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      if (!query) return;
      setLoading(true);
      try {
        const start = ((page - 1) * 10) + 1;
        const data = await searchImages(query, start);
        setResults(data.items);
        setTotalResults(data.totalResults);
      } catch (error) {
        console.error('Image search error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [query, page]);

  return (
    <div className="min-h-screen">
      <SearchHeader />
      
      <main className="container py-6">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <div className="p-2">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {results.map((result, index) => (
                <Card key={index} className="overflow-hidden group cursor-pointer">
                  <a href={result.link} target="_blank" rel="noopener noreferrer">
                    <div className="relative aspect-video">
                      <img
                        src={result.thumbnail}
                        alt={result.title}
                        className="object-cover w-full h-full transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-2">
                      <h3 className="text-sm font-medium truncate">{result.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new URL(result.link).hostname}
                      </p>
                    </div>
                  </a>
                </Card>
              ))}
            </div>

            {results.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => {
                    const searchParams = new URLSearchParams(window.location.search);
                    searchParams.set('page', (page - 1).toString());
                    window.location.search = searchParams.toString();
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={results.length < 10}
                  onClick={() => {
                    const searchParams = new URLSearchParams(window.location.search);
                    searchParams.set('page', (page + 1).toString());
                    window.location.search = searchParams.toString();
                  }}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}