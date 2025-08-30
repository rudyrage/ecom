"use client";

import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import type { Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export default function ProductCard({
  product,
  disable,
}: {
  product: Product;
  disable?: boolean;
}) {
  const { isAuthenticated } = useAuthStore();
  const { addItem, isLoading } = useCartStore();
  const router = useRouter();

  if (!product) {
    return null;
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    await addItem(product.id);
  };

  const handleProductClick = () => {
    if (disable) return;
    router.push(`/product/${product.id}`);
  };

  const cursorType = disable ? "" : "cursor-pointer";

  return (
    <div className="bg-white max-w-[500px] m-auto text-gray-400 p-4 rounded-2xl shadow hover:shadow-lg transition-shadow">
      <div className={"relative" + cursorType} onClick={handleProductClick}>
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name || "Product"}
          className="object-cover w-full h-auto rounded-xl"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      <div className={"mt-3" + cursorType} onClick={handleProductClick}>
        <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
          {product.name || "Unnamed Product"}
        </h3>
        <p className="text-gray-600 text-sm mt-1">
          {product.description
            ? `${product.description.slice(0, 60)}...`
            : "No description available"}
        </p>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-blue-600">
            ${product.price?.toString() || "0.00"}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${product.originalPrice.toString()}
            </span>
          )}
        </div>

        <Button
          onClick={(e) => {
            if (disable) return;
            e.stopPropagation();
            handleAddToCart();
          }}
          disabled={!product.inStock || isLoading}
          size="sm"
          className="flex items-center gap-1 text-green-950"
        >
          <ShoppingCart className="h-4 w-4" />
          {isLoading ? "Adding..." : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
