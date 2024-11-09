"use client";

import { SearchHeader } from "@/components/search-header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchNews, type NewsResult } from "@/lib/search-service";
import { Button } from "@/components/ui/button";

interface NewsResult {
  url: string;
  title: string;
  description?: string;
  publishedAt: string;
  urlToImage?: string;
  source?: {
    id?: string;
    name?: string;
  };
}

export default function NewsSearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const [results, setResults] = useState<NewsResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      if (!query) return;
      setLoading(true);
      try {
        const data = await searchNews(query, page);
        setResults(data.articles);
        setTotalResults(data.totalResults);
      } catch (error) {
        console.error("News search error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [query, page]);

  return (
    <div className="min-h-screen">
      <SearchHeader />

      <main className="container max-w-4xl py-6">
        {loading ? (
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex gap-4">
                  <Skeleton className="h-32 w-48 shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/4 mb-4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {results.map((result, index) => (
                <Card key={index} className="p-4 hover:bg-muted/50">
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-4"
                  >
                    {result.urlToImage && (
                      <img
                        src={result.urlToImage}
                        alt={result.title}
                        className="h-32 w-48 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <span>{result.source?.name || "Unknown Source"}</span>
                        <span>•</span>
                        <span>{new Date(result.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <h2 className="text-xl font-semibold mb-2">{result.title}</h2>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {result.description}
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
                    searchParams.set("page", (page - 1).toString());
                    window.location.search = searchParams.toString();
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={page * 20 >= totalResults}
                  onClick={() => {
                    const searchParams = new URLSearchParams(window.location.search);
                    searchParams.set("page", (page + 1).toString());
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
