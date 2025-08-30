"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const categories = [
  { name: "All Products", href: "/" },
  { name: "Electronics", href: "/category/electronics" },
  { name: "Clothing", href: "/category/clothing" },
  { name: "Home & Garden", href: "/category/home-garden" },
  { name: "Sports", href: "/category/sports" },
  { name: "Books", href: "/category/books" },
  { name: "Health & Beauty", href: "/category/health-beauty" },
]

export default function CategoryNav() {
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-8 px-4 py-3 overflow-x-auto">
          {categories.map((category) => {
            const isActive = pathname === category.href
            return (
              <Link
                key={category.name}
                href={category.href}
                className={`whitespace-nowrap text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActive ? "text-blue-600 border-b-2 border-blue-600 pb-3" : "text-gray-700 pb-3"
                }`}
              >
                {category.name}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
