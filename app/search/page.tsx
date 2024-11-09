"use client";

import { SearchHeader } from "@/components/search-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchWeb, type SearchResult } from "@/lib/search-service";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTime, setSearchTime] = useState(0);

  useEffect(() => {
    async function fetchResults() {
      if (!query) return;
      setLoading(true);
      const startFetchTime = new Date().getTime(); // Start time
      try {
        const start = (page - 1) * 10 + 1;
        const data = await searchWeb(query, start);
        setResults(data.items);
        setTotalResults(data.totalResults);

        // Calculate the time taken in seconds
        const endFetchTime = new Date().getTime(); // End time
        setSearchTime((endFetchTime - startFetchTime) / 1000); // Convert ms to seconds
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [query, page]);

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-gray-900 dark:text-gray-100">
      <SearchHeader />

      <main className="flex flex-col items-center py-6 px-4">
        <p className="text-sm text-muted-foreground mb-4">
          About {loading ? "..." : totalResults.toLocaleString()} results
          {searchTime > 0 && ` in ${searchTime} seconds`}
        </p>

        <div className="container max-w-3xl space-y-6">
          {loading ? (
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="p-4 dark:bg-gray-800">
                  <Skeleton className="h-4 w-[250px] mb-2" />
                  <Skeleton className="h-4 w-[400px] mb-4" />
                  <Skeleton className="h-4 w-[350px]" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {results.map((result, index) => (
                <Card key={index} className="p-4 hover:bg-muted/50 dark:bg-gray-800 dark:hover:bg-gray-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        {result.link}
                      </div>
                      <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 hover:underline mb-2">
                        <a href={result.link} target="_blank" rel="noopener noreferrer">
                          {result.title}
                        </a>
                      </h2>
                      <p className="text-sm text-muted-foreground">{result.snippet}</p>
                    </div>
                    <Button size="icon" variant="ghost" asChild>
                      <a href={result.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="flex items-center justify-center gap-4 mt-8">
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
              <span className="text-sm text-muted-foreground">
                Page {page}
              </span>
              <Button
                variant="outline"
                disabled={results.length < 10}
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
        </div>
      </main>
    </div>
  );
}
