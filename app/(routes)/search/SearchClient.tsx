"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSearchStore } from "@/store/search.store";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import SearchBar from "@/components/SearchBar";
import { Loader2 } from "lucide-react";
import { Product } from "@prisma/client";

function SearchContent() {
  const searchParams = useSearchParams();
  const { results, isLoading, totalResults, query, searchProducts } =
    useSearchStore();

  useEffect(() => {
    const searchQuery = searchParams.get("q") || "";
    const category = searchParams.get("category");

    const filters: any = {};
    if (category) filters.category = category;

    searchProducts(searchQuery, filters);
  }, [searchParams, searchProducts]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        {/* Search Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {query ? `Search Results for "${query}"` : "Search Products"}
          </h1>

          {/* Mobile Search Bar */}
          <div className="md:hidden mb-4">
            <SearchBar />
          </div>

          {totalResults > 0 && (
            <p className="text-gray-600">
              Found {totalResults} product{totalResults !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <ProductFilters />
          </div>

          {/* Results */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product as unknown as Product}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500">
                  {query
                    ? `No products match your search for "${query}". Try adjusting your filters or search terms.`
                    : "Try searching for products or adjusting your filters."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchClient() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
