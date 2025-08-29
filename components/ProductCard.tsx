"use client";

import { useAuthStore } from "@/store/auth.store";
import { Product } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }: { product: Product }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    alert(`✅ Added ${product.name} to cart!`);
    // later: call /api/cart
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-xl"
      />
      <h3 className="mt-3 font-semibold">{product.name}</h3>
      <p className="text-gray-600 text-sm">
        {product.description.slice(0, 60)}...
      </p>
      <div className="mt-2 flex justify-between items-center">
        <span className="text-lg font-bold">${product.price.toString()}</span>
        <button
          onClick={handleAddToCart}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
