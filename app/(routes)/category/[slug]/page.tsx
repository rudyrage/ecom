"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useSearchStore } from "@/store/search.store";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import { Loader2 } from "lucide-react";

const categoryMap: Record<string, string> = {
  electronics: "Electronics",
  clothing: "Clothing",
  "home-garden": "Home & Garden",
  sports: "Sports",
  books: "Books",
  "health-beauty": "Health & Beauty",
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { results, isLoading, totalResults, searchProducts } = useSearchStore();

  const categoryName = categoryMap[slug] || slug;

  useEffect(() => {
    if (slug && categoryMap[slug]) {
      searchProducts("", { category: categoryMap[slug] });
    }
  }, [slug, searchProducts]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        {/* Category Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {categoryName}
          </h1>
          {totalResults > 0 && (
            <p className="text-gray-600">
              {totalResults} product{totalResults !== 1 ? "s" : ""} available
            </p>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <ProductFilters />
          </div>

          {/* Products */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
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
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0H4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500">
                  No products available in the {categoryName} category at the
                  moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
