import React from 'react';
import Link from 'next/link';
import { Product } from '@/hooks/useProducts';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface SearchResultsProps {
  products: Product[];
  isVisible: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  products, 
  isVisible, 
  onClose, 
  isLoading = false 
}) => {
  if (!isVisible) return null;

  if (isLoading) {
    return (
      <Card className="absolute top-full left-0 right-0 z-50 mt-1 shadow-lg">
        <div className="p-4 text-center">
          <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground mt-2">Searching...</p>
        </div>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card className="absolute top-full left-0 right-0 z-50 mt-1 shadow-lg">
        <div className="p-4 text-center">
          <p className="text-sm text-muted-foreground">No products found</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-y-auto shadow-lg">
      <div className="p-2">
        {products.slice(0, 8).map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-12 h-12 object-cover rounded-md"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{product.name}</h4>
              <p className="text-muted-foreground text-xs">{product.category}</p>
              <p className="font-semibold text-sm">${product.price.toFixed(2)}</p>
            </div>
          </Link>
        ))}
        {products.length > 8 && (
          <div className="p-3 text-center text-muted-foreground text-sm border-t">
            {products.length - 8} more results...
          </div>
        )}
      </div>
    </Card>
  );
};

export default SearchResults;