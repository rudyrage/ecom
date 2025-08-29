import { PrismaClient, Product } from "@prisma/client";
import ProductCard from "../components/ProductCard";

const prisma = new PrismaClient();

export default async function HomePage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-blue-600">MyShop</h1>
          <nav className="space-x-4">
            <a href="/login" className="text-gray-600 hover:text-blue-600">
              Login
            </a>
            <a href="/register" className="text-gray-600 hover:text-blue-600">
              Register
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}
