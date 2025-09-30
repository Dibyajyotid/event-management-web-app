"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdvancedSearch } from "@/components/search/AdvancedSearch";
import { EventCard } from "@/components/events/EventCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { Event } from "@/types/eventTypes";

interface SearchResults {
  events: Event[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  facets: {
    categories: Array<{ _id: string; count: number }>;
    priceRange: { minPrice: number; maxPrice: number; avgPrice: number };
    popularTags: Array<{ _id: string; count: number }>;
  };
  searchQuery: {
    q?: string;
    category?: string;
    location?: string;
    tags?: string;
  };
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const hasSearchParams = Array.from(searchParams.entries()).length > 0;
    if (hasSearchParams) {
      performSearch();
    }
  }, [searchParams]);

  const performSearch = async () => {
    setLoading(true);
    setError("");

    try {
      const queryString = searchParams.toString();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/search/events?${queryString}`
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    window.history.pushState({}, "", `?${params.toString()}`);
    performSearch();
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Search Events</h1>
            <p className="text-muted-foreground">
              Find the perfect events for you with our advanced search
            </p>
          </div>

          {/* Advanced Search */}
          <AdvancedSearch />

          {/* Search Results */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Searching events...</span>
            </div>
          )}

          {error && (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-red-500">{error}</p>
              </CardContent>
            </Card>
          )}

          {results && !loading && (
            <div className="space-y-6">
              {/* Results Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Search Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      Found {results.pagination.totalResults} events
                      {results.searchQuery.q &&
                        ` for "${results.searchQuery.q}"`}
                    </span>
                    {results.searchQuery.category &&
                      results.searchQuery.category !== "all" && (
                        <Badge variant="outline">
                          Category: {results.searchQuery.category}
                        </Badge>
                      )}
                    {results.searchQuery.location && (
                      <Badge variant="outline">
                        Location: {results.searchQuery.location}
                      </Badge>
                    )}
                    {results.searchQuery.tags && (
                      <Badge variant="outline">
                        Tags: {results.searchQuery.tags}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Search Facets */}
              {(results.facets.categories.length > 0 ||
                results.facets.popularTags.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Categories */}
                  {results.facets.categories.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Categories</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {results.facets.categories
                            .slice(0, 5)
                            .map((category) => (
                              <div
                                key={category._id}
                                className="flex justify-between text-sm"
                              >
                                <span className="capitalize">
                                  {category._id}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  {category.count}
                                </Badge>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Price Range */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Price Range</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Min Price:</span>
                          <span>${results.facets.priceRange.minPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Max Price:</span>
                          <span>${results.facets.priceRange.maxPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Price:</span>
                          <span>
                            ${Math.round(results.facets.priceRange.avgPrice)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Popular Tags */}
                  {results.facets.popularTags.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Popular Tags</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1">
                          {results.facets.popularTags.slice(0, 8).map((tag) => (
                            <Badge
                              key={tag._id}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag._id} ({tag.count})
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Events Grid */}
              {results.events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.events.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">
                      No events found
                    </h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search criteria or browse all events
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Pagination */}
              {results.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Page {results.pagination.currentPage} of{" "}
                    {results.pagination.totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handlePageChange(results.pagination.currentPage - 1)
                      }
                      disabled={!results.pagination.hasPrev}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handlePageChange(results.pagination.currentPage + 1)
                      }
                      disabled={!results.pagination.hasNext}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
