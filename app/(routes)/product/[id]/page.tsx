import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const params_ = await params;
  const product = await prisma.product.findUnique({
    where: { id: params_.id },
  });

  if (!product) return notFound();

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <ProductCard product={product} />
      </div>
    </>
  );
}
