import { prisma } from "@/lib/prisma";

async function main() {
  const categories = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Sports",
    "Books",
    "Health & Beauty",
  ];

  for (const categoryName of categories) {
    await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    });
  }
  console.log("✅ Categories created");

  console.log("📦 Creating products...");
  const products = [
    {
      name: "iPhone 15 Pro Max",
      description:
        "Apple's flagship smartphone with A17 Pro chip, 6.7-inch Super Retina XDR display, and advanced camera system.",
      price: 1199.0,
      originalPrice: 1299.0,
      category: "Electronics",
      image: "https://m.media-amazon.com/images/I/616mZZm8-7L._AC_SL1000_.jpg",
      images: [
        "https://m.media-amazon.com/images/I/51aQDNOAr5L.jpg",
        "https://m.media-amazon.com/images/I/61idlljS-OL._AC_SL1000_.jpg",
      ],
      rating: 5,
      reviews: 3200,
      inStock: true,
      featured: true,
      tags: ["smartphone", "Apple", "iOS", "iPhone"],
      stockQuantity: 15,
    },
    {
      name: "Mechanical Gaming Keyboard",
      description:
        "RGB backlit mechanical keyboard with tactile switches and programmable keys.",
      price: 149.99,
      originalPrice: 199.99,
      category: "Electronics",
      image:
        "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop",
      ],
      rating: 4.9,
      reviews: 680,
      inStock: true,
      featured: true,
      tags: ["gaming", "mechanical", "RGB", "keyboard"],
      stockQuantity: 35,
    },
    {
      name: "Organic Skincare Set",
      description:
        "Complete organic skincare routine with natural ingredients for all skin types.",
      price: 69.99,
      originalPrice: null,
      category: "Health & Beauty",
      image:
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop",
      ],
      rating: 4.8,
      reviews: 520,
      inStock: true,
      featured: true,
      tags: ["organic", "skincare", "natural"],
      stockQuantity: 40,
    },
    {
      name: "Classic Novel Collection",
      description:
        "Beautiful hardcover collection of classic literature with gold-embossed covers.",
      price: 89.99,
      originalPrice: 129.99,
      category: "Books",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop",
      ],
      rating: 4.9,
      reviews: 150,
      inStock: true,
      featured: false,
      tags: ["books", "literature", "hardcover"],
      stockQuantity: 20,
    },
    {
      name: "Yoga Mat Pro",
      description:
        "Non-slip premium yoga mat with extra cushioning and eco-friendly materials.",
      price: 49.99,
      originalPrice: null,
      category: "Sports",
      image:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop",
      ],
      rating: 4.89,
      reviews: 280,
      inStock: true,
      featured: false,
      tags: ["yoga", "exercise", "eco-friendly"],
      stockQuantity: 75,
    },
    {
      name: "Modern LED Desk Lamp",
      description:
        "Adjustable LED desk lamp with touch controls and USB charging port.",
      price: 79.99,
      originalPrice: 99.99,
      category: "Home & Garden",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&h=500&fit=crop",
      ],
      rating: 5,
      reviews: 450,
      inStock: true,
      featured: true,
      tags: ["LED", "desk", "adjustable", "modern"],
      stockQuantity: 25,
    },
    {
      name: "Premium Cotton T-Shirt",
      description:
        "Soft, comfortable premium cotton t-shirt with perfect fit and lasting quality.",
      price: 29.99,
      originalPrice: null,
      category: "Clothing",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=500&h=500&fit=crop",
      ],
      rating: 4.9,
      reviews: 320,
      inStock: true,
      featured: false,
      tags: ["cotton", "casual", "comfortable"],
      stockQuantity: 100,
    },
    {
      name: "Smart Fitness Watch",
      description:
        "Advanced fitness tracking with heart rate monitor, GPS, and 7-day battery life.",
      price: 299.99,
      originalPrice: 399.99,
      category: "Electronics",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&h=500&fit=crop",
      ],
      rating: 4.9,
      reviews: 850,
      inStock: true,
      featured: true,
      tags: ["fitness", "smartwatch", "health"],
      stockQuantity: 30,
    },
    {
      name: "Wireless Bluetooth Headphones",
      description:
        "Premium noise-cancelling wireless headphones with 30-hour battery life and crystal-clear sound quality.",
      price: 199.99,
      originalPrice: 299.99,
      category: "Electronics",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500&h=500&fit=crop",
      ],
      rating: 4.8,
      reviews: 1250,
      inStock: true,
      featured: true,
      tags: ["wireless", "bluetooth", "noise-cancelling"],
      stockQuantity: 50,
    },
    {
      name: "4K Ultra HD Smart TV",
      description:
        "65-inch 4K Ultra HD Smart TV with HDR10, Dolby Vision, and built-in streaming apps.",
      price: 899.99,
      originalPrice: 1199.99,
      category: "Electronics",
      image:
        "https://images.unsplash.com/photo-1593784991095-0d2d2e940a56?w=500&h=500&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1593784991095-0d2d2e940a56?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1585088799119-97f6e64fa9f6?w=500&h=500&fit=crop",
      ],
      rating: 4.7,
      reviews: 970,
      inStock: true,
      featured: true,
      tags: ["TV", "4K", "smart"],
      stockQuantity: 40,
    },
    {
      name: "Wireless Charging Pad",
      description:
        "Fast wireless charging pad compatible with iPhone, Samsung, and other Qi-enabled devices.",
      price: 39.99,
      originalPrice: 59.99,
      category: "Electronics",
      image:
        "https://images.unsplash.com/photo-1587727703258-73be3a6d4f4e?w=500&h=500&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1587727703258-73be3a6d4f4e?w=500&h=500&fit=crop",
      ],
      rating: 4.4,
      reviews: 410,
      inStock: true,
      featured: false,
      tags: ["wireless", "charging", "accessory"],
      stockQuantity: 75,
    },
    {
      name: "Ergonomic Office Chair",
      description:
        "High-back ergonomic office chair with adjustable armrests, lumbar support, and breathable mesh.",
      price: 249.99,
      originalPrice: 349.99,
      category: "Home & Garden",
      image:
        "https://images.unsplash.com/photo-1588776814546-ec03f6820f79?w=500&h=500&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1588776814546-ec03f6820f79?w=500&h=500&fit=crop",
      ],
      rating: 4.6,
      reviews: 560,
      inStock: true,
      featured: true,
      tags: ["office", "chair", "ergonomic"],
      stockQuantity: 30,
    },
    {
      name: "Luxury Silk Bed Sheets",
      description:
        "Premium 100% silk bed sheets for ultimate comfort and a luxurious sleep experience.",
      price: 199.99,
      originalPrice: 299.99,
      category: "Home & Garden",
      image:
        "https://images.unsplash.com/photo-1581788467284-ccd1189a6606?w=500&h=500&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1581788467284-ccd1189a6606?w=500&h=500&fit=crop",
      ],
      rating: 4.8,
      reviews: 320,
      inStock: true,
      featured: false,
      tags: ["bed", "sheets", "silk"],
      stockQuantity: 45,
    },
    {
      name: "Portable Camping Stove",
      description:
        "Lightweight portable camping stove with adjustable flame control and compact design.",
      price: 89.99,
      originalPrice: 119.99,
      category: "Sports",
      image:
        "https://images.unsplash.com/photo-1617196035976-3681f7d7c2a9?w=500&h=500&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1617196035976-3681f7d7c2a9?w=500&h=500&fit=crop",
      ],
      rating: 4.5,
      reviews: 220,
      inStock: true,
      featured: true,
      tags: ["camping", "outdoor", "stove"],
      stockQuantity: 60,
    },
    {
      name: "Mountain Bike Pro",
      description:
        "Durable mountain bike with 21-speed gears, hydraulic disc brakes, and aluminum frame.",
      price: 599.99,
      originalPrice: 799.99,
      category: "Sports",
      image:
        "https://images.unsplash.com/photo-1605719125118-d43e67632a0b?w=500&h=500&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1605719125118-d43e67632a0b?w=500&h=500&fit=crop",
      ],
      rating: 4.7,
      reviews: 380,
      inStock: true,
      featured: true,
      tags: ["bike", "outdoor", "cycling"],
      stockQuantity: 20,
    },
    {
      name: "Leather Messenger Bag",
      description:
        "Stylish and durable leather messenger bag with multiple compartments and adjustable strap.",
      price: 149.99,
      originalPrice: 199.99,
      category: "Clothing",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
      ],
      rating: 4.6,
      reviews: 440,
      inStock: true,
      featured: true,
      tags: ["bag", "leather", "fashion"],
      stockQuantity: 50,
    },
    {
      name: "Winter Wool Coat",
      description:
        "Elegant wool coat with double-breasted buttons and tailored fit, perfect for winter.",
      price: 229.99,
      originalPrice: 299.99,
      category: "Clothing",
      image:
        "https://images.unsplash.com/photo-1585314062340-f1a5f3e8c8f4?w=500&h=500&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1585314062340-f1a5f3e8c8f4?w=500&h=500&fit=crop",
      ],
      rating: 4.5,
      reviews: 210,
      inStock: true,
      featured: false,
      tags: ["coat", "winter", "wool"],
      stockQuantity: 70,
    },
    {
      name: "Stainless Steel Cookware Set",
      description:
        "10-piece stainless steel cookware set with non-stick coating and ergonomic handles.",
      price: 249.99,
      originalPrice: 349.99,
      category: "Home & Garden",
      image:
        "https://images.unsplash.com/photo-1601046237709-65a878df5937?w=500&h=500&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1601046237709-65a878df5937?w=500&h=500&fit=crop",
      ],
      rating: 4.7,
      reviews: 310,
      inStock: true,
      featured: true,
      tags: ["cookware", "kitchen", "steel"],
      stockQuantity: 25,
    },
    {
      name: "Espresso Coffee Machine",
      description:
        "Premium espresso machine with milk frother, pressure control, and modern design.",
      price: 349.99,
      originalPrice: 449.99,
      category: "Home & Garden",
      image:
        "https://images.unsplash.com/photo-1553909489-cf6e7b5c1b2c?w=500&h=500&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1553909489-cf6e7b5c1b2c?w=500&h=500&fit=crop",
      ],
      rating: 4.8,
      reviews: 640,
      inStock: true,
      featured: true,
      tags: ["coffee", "espresso", "kitchen"],
      stockQuantity: 18,
    },
    {
      name: "Noise-Cancelling Earbuds",
      description:
        "Compact wireless earbuds with active noise cancellation and 24-hour battery life.",
      price: 129.99,
      originalPrice: 179.99,
      category: "Electronics",
      image:
        "https://images.unsplash.com/photo-1611152772373-9aa43a9e2ca3?w=500&h=500&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1611152772373-9aa43a9e2ca3?w=500&h=500&fit=crop",
      ],
      rating: 4.6,
      reviews: 520,
      inStock: true,
      featured: true,
      tags: ["earbuds", "wireless", "noise-cancelling"],
      stockQuantity: 80,
    },
    {
      name: "Luxury Wristwatch",
      description:
        "Sophisticated stainless steel wristwatch with automatic movement and sapphire glass.",
      price: 499.99,
      originalPrice: 699.99,
      category: "Electronics",
      image:
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&h=500&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&h=500&fit=crop",
      ],
      rating: 4.8,
      reviews: 290,
      inStock: true,
      featured: false,
      tags: ["watch", "luxury", "fashion"],
      stockQuantity: 40,
    },
    {
      name: "Bestselling Thriller Novel",
      description:
        "A gripping thriller novel with unexpected twists and page-turning suspense.",
      price: 24.99,
      originalPrice: 34.99,
      category: "Books",
      image:
        "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=500&h=500&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=500&h=500&fit=crop",
      ],
      rating: 4.7,
      reviews: 1200,
      inStock: true,
      featured: true,
      tags: ["thriller", "novel", "bestseller"],
      stockQuantity: 100,
    },
    {
      name: "Cookbook for Beginners",
      description:
        "Step-by-step cookbook with easy recipes for delicious homemade meals.",
      price: 29.99,
      originalPrice: 39.99,
      category: "Books",
      image:
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&h=500&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&h=500&fit=crop",
      ],
      rating: 4.5,
      reviews: 340,
      inStock: true,
      featured: false,
      tags: ["cookbook", "cooking", "recipes"],
      stockQuantity: 80,
    },
    {
      name: "Deluxe Makeup Kit",
      description:
        "Complete makeup kit with eyeshadows, lipsticks, and blushes in a premium case.",
      price: 89.99,
      originalPrice: 119.99,
      category: "Health & Beauty",
      image:
        "https://images.unsplash.com/photo-1586481881273-7a3c8b8d71b2?w=500&h=500&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1586481881273-7a3c8b8d71b2?w=500&h=500&fit=crop",
      ],
      rating: 4.6,
      reviews: 740,
      inStock: true,
      featured: true,
      tags: ["makeup", "beauty", "cosmetics"],
      stockQuantity: 60,
    },
    {
      name: "Electric Toothbrush Pro",
      description:
        "Rechargeable electric toothbrush with multiple brushing modes and 2-minute timer.",
      price: 79.99,
      originalPrice: 99.99,
      category: "Health & Beauty",
      image:
        "https://cdn.pixabay.com/photo/2017/03/08/20/04/toothbrush-2127681_960_720.jpg",
      images: [
        "https://cdn.pixabay.com/photo/2017/03/08/20/04/toothbrush-2127681_960_720.jpg",
      ],
      rating: 4.7,
      reviews: 520,
      inStock: true,
      featured: false,
      tags: ["toothbrush", "dental", "hygiene"],
      stockQuantity: 90,
    },
    {
      name: "Men’s Running Shoes",
      description:
        "Lightweight and breathable running shoes with shock absorption and durable sole.",
      price: 129.99,
      originalPrice: 169.99,
      category: "Clothing",
      image:
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=500&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=500&fit=crop",
      ],
      rating: 4.6,
      reviews: 680,
      inStock: true,
      featured: true,
      tags: ["shoes", "running", "men"],
      stockQuantity: 120,
    },
    {
      name: "Women’s Summer Dress",
      description:
        "Elegant floral summer dress with breathable fabric and flattering design.",
      price: 59.99,
      originalPrice: 79.99,
      category: "Clothing",
      image:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop",
      ],
      rating: 4.5,
      reviews: 400,
      inStock: true,
      featured: false,
      tags: ["dress", "summer", "fashion"],
      stockQuantity: 85,
    },
    {
      name: "Resistance Bands Set",
      description:
        "Set of 5 resistance bands with varying strengths, perfect for strength training and yoga.",
      price: 39.99,
      originalPrice: 59.99,
      category: "Sports",
      image:
        "https://images.unsplash.com/photo-1599058918146-cd38c163b1d2?w=500&h=500&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1599058918146-cd38c163b1d2?w=500&h=500&fit=crop",
      ],
      rating: 4.6,
      reviews: 260,
      inStock: true,
      featured: true,
      tags: ["fitness", "bands", "exercise"],
      stockQuantity: 150,
    },
    {
      name: "Hydrating Face Serum",
      description:
        "Vitamin C and hyaluronic acid face serum for glowing, hydrated skin.",
      price: 49.99,
      originalPrice: 69.99,
      category: "Health & Beauty",
      image:
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=500&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=500&fit=crop",
      ],
      rating: 4.7,
      reviews: 880,
      inStock: true,
      featured: true,
      tags: ["skincare", "serum", "hydration"],
      stockQuantity: 110,
    },
  ];

  for (const product of products) {
    const productId = product.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    await prisma.product.upsert({
      where: { id: productId },
      update: {},
      create: {
        id: productId,
        ...product,
      },
    });
  }
  console.log("✅ Products created");

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
