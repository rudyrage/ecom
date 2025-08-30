import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SearchResults from "./search-results";
import { Product } from "@/hooks/useProducts";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search products...",
  className = "",
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.trim()) {
      setIsLoading(true);
      // Fetch products from API based on search term
      fetch(`/api/products?search=${encodeURIComponent(searchTerm)}`)
        .then((res) => res.json())
        .then((data) => {
          setFilteredProducts(data.products || []);
          setIsResultsVisible(true);
        })
        .catch((error) => {
          console.error("Error searching products:", error);
          setFilteredProducts([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setFilteredProducts([]);
      setIsResultsVisible(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsResultsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleResultsClose = () => {
    setIsResultsVisible(false);
    setSearchTerm("");
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => searchTerm && setIsResultsVisible(true)}
          className="pl-10 bg-secondary/50 border-0"
        />
      </div>
      <SearchResults
        products={filteredProducts}
        isVisible={isResultsVisible}
        onClose={handleResultsClose}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SearchBar;
