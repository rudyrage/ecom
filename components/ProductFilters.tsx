"use client";

import { useSearchStore } from "@/store/search.store";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Filter, X } from "lucide-react";
import { useState } from "react";

const categories = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports",
  "Books",
  "Health & Beauty",
];

export default function ProductFilters() {
  const { filters, setFilters, clearFilters, search } = useSearchStore();
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([
    filters.minPrice || 0,
    filters.maxPrice || 1000,
  ]);

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    setFilters({
      minPrice: value[0],
      maxPrice: value[1],
    });
    setTimeout(() => search(), 300);
  };

  const handleCategoryChange = (category: string) => {
    setFilters({ category: category === "all" ? undefined : category });
    setTimeout(() => search(), 100);
  };

  const handleRatingChange = (rating: number) => {
    setFilters({
      minRating: rating === filters.minRating ? undefined : rating,
    });
    setTimeout(() => search(), 100);
  };

  const handleStockChange = (checked: boolean) => {
    setFilters({ inStock: checked ? true : undefined });
    setTimeout(() => search(), 100);
  };

  const handleFeaturedChange = (checked: boolean) => {
    setFilters({ featured: checked ? true : undefined });
    setTimeout(() => search(), 100);
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-");
    setFilters({ sortBy: sortBy as any, sortOrder: sortOrder as any });
    setTimeout(() => search(), 100);
  };

  const applyFilters = () => {
    search();
    setIsOpen(false);
  };

  const resetFilters = () => {
    clearFilters();
    setPriceRange([0, 1000]);
    search();
  };

  return (
    <div className="relative">
      {/* Mobile Filter Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center gap-2"
      >
        <Filter className="h-4 w-4" />
        Filters
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Filter Panel */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:block fixed md:relative top-0 left-0 right-0 bottom-0 md:top-auto md:left-auto md:right-auto md:bottom-auto bg-white md:bg-transparent border-0 md:border-0 shadow-none md:shadow-none p-0 md:p-0 z-[101] md:z-auto overflow-y-auto md:overflow-visible`}
      >
        <div className="h-full md:h-auto bg-white md:bg-transparent p-6 md:p-0">
          <div className="flex items-center justify-between mb-6 md:hidden">
            <h3 className="text-xl font-semibold text-gray-900">
              Filter Products
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-8 md:space-y-6">
            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-3">
                Sort By
              </label>
              <Select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="bg-white text-gray-500 border-gray-200 shadow-sm">
                  <SelectValue>Newest first</SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-500 border border-gray-200 shadow-xl z-[102]">
                  <SelectItem value="createdAt-desc">Newest First</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating-desc">Highest Rated</SelectItem>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Category
              </label>
              <Select
                value={filters.category || "all"}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="bg-white text-gray-500 border-gray-200 shadow-sm">
                  <SelectValue></SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white border text-gray-500 border-gray-200 shadow-xl z-[102]">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <div className="p-4 rounded-lg border border-gray-200">
                <Slider
                  value={priceRange}
                  onValueChange={handlePriceChange}
                  max={1000}
                  min={0}
                  step={10}
                  className="w-full bg-gray-400 rounded-md"
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Minimum Rating
              </label>
              <div className="flex gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRatingChange(rating)}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      (filters.minRating || 0) >= rating
                        ? "text-yellow-500 bg-yellow-50 shadow-sm"
                        : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
                    }`}
                  >
                    <Star className="h-5 w-5 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            {/* Stock & Featured */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="inStock"
                  checked={filters.inStock || false}
                  onCheckedChange={handleStockChange}
                />
                <label
                  htmlFor="inStock"
                  className="text-sm font-medium text-gray-700"
                >
                  In Stock Only
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="featured"
                  checked={filters.featured || false}
                  onCheckedChange={handleFeaturedChange}
                />
                <label
                  htmlFor="featured"
                  className="text-sm font-medium text-gray-700"
                >
                  Featured Products
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <Button
                onClick={applyFilters}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Apply Filters
              </Button>
              <Button
                variant="outline"
                onClick={resetFilters}
                className="border-gray-300 hover:bg-gray-50 bg-transparent"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
