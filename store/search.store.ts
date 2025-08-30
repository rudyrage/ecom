import { create } from "zustand";

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  rating?: number;
  inStock?: boolean;
  featured?: boolean;
}

interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  featured?: boolean;
  sortBy?: "name" | "price" | "rating" | "createdAt";
  sortOrder?: "asc" | "desc";
}

interface SearchState {
  query: string;
  filters: SearchFilters;
  results: Product[];
  isLoading: boolean;
  totalResults: number;
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  clearFilters: () => void;
  search: () => Promise<void>;
  searchProducts: (query: string, filters?: SearchFilters) => Promise<void>;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: "",
  filters: {
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  results: [],
  isLoading: false,
  totalResults: 0,

  setQuery: (query: string) => {
    set({ query });
  },

  setFilters: (newFilters: Partial<SearchFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  clearFilters: () => {
    set({
      filters: {
        sortBy: "createdAt",
        sortOrder: "desc",
      },
    });
  },

  search: async () => {
    const { query, filters } = get();
    await get().searchProducts(query, filters);
  },

  searchProducts: async (query: string, filters: SearchFilters = {}) => {
    set({ isLoading: true });

    try {
      const searchParams = new URLSearchParams();

      if (query) searchParams.append("q", query);
      if (filters.category) searchParams.append("category", filters.category);
      if (filters.minPrice !== undefined)
        searchParams.append("minPrice", filters.minPrice.toString());
      if (filters.maxPrice !== undefined)
        searchParams.append("maxPrice", filters.maxPrice.toString());
      if (filters.minRating !== undefined)
        searchParams.append("minRating", filters.minRating.toString());
      if (filters.inStock !== undefined)
        searchParams.append("inStock", filters.inStock.toString());
      if (filters.featured !== undefined)
        searchParams.append("featured", filters.featured.toString());
      if (filters.sortBy) searchParams.append("sortBy", filters.sortBy);
      if (filters.sortOrder)
        searchParams.append("sortOrder", filters.sortOrder);

      const response = await fetch(`/api/search?${searchParams.toString()}`);

      if (response.ok) {
        const data = await response.json();
        set({
          results: data.products,
          totalResults: data.total,
          query,
          filters,
        });
      }
    } catch (error) {
      console.error("Search failed:", error);
      set({ results: [], totalResults: 0 });
    } finally {
      set({ isLoading: false });
    }
  },
}));
