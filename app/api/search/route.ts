import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q") || "";
  const category = searchParams.get("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const minRating = searchParams.get("minRating");
  const inStock = searchParams.get("inStock");
  const featured = searchParams.get("featured");
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  try {
    // Build where clause
    const where: any = {};

    // Text search
    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { tags: { hasSome: [query] } },
      ];
    }

    // Category filter
    if (category && category !== "all") {
      where.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number.parseFloat(minPrice);
      if (maxPrice) where.price.lte = Number.parseFloat(maxPrice);
    }

    // Rating filter
    if (minRating) {
      where.rating = { gte: Number.parseFloat(minRating) };
    }

    // Stock filter
    if (inStock === "true") {
      where.inStock = true;
    }

    // Featured filter
    if (featured === "true") {
      where.featured = true;
    }

    // Build orderBy clause
    const orderBy: any = {};
    if (sortBy === "price" || sortBy === "rating" || sortBy === "createdAt") {
      orderBy[sortBy] = sortOrder;
    } else if (sortBy === "name") {
      orderBy.name = sortOrder;
    }

    // Execute search
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        take: 50, // Limit results
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      total,
      query,
      filters: {
        category,
        minPrice: minPrice ? Number.parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? Number.parseFloat(maxPrice) : undefined,
        minRating: minRating ? Number.parseFloat(minRating) : undefined,
        inStock: inStock === "true",
        featured: featured === "true",
        sortBy,
        sortOrder,
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed", products: [], total: 0 },
      { status: 500 }
    );
  }
}
