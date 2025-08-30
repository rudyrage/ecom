"use client"

import { useState } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const categories = ["Electronics", "Clothing", "Home & Garden", "Sports", "Books", "Health & Beauty"]

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [showCategories, setShowCategories] = useState(false)

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)} className="md:hidden">
        <Menu className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />

          {/* Menu */}
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <nav className="p-4 space-y-4">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="block text-gray-700 hover:text-blue-600 font-medium"
              >
                Home
              </Link>

              <div>
                <button
                  onClick={() => setShowCategories(!showCategories)}
                  className="flex items-center justify-between w-full text-gray-700 hover:text-blue-600 font-medium"
                >
                  Categories
                  <ChevronDown className={`h-4 w-4 transition-transform ${showCategories ? "rotate-180" : ""}`} />
                </button>

                {showCategories && (
                  <div className="mt-2 ml-4 space-y-2">
                    {categories.map((category) => (
                      <Link
                        key={category}
                        href={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
                        onClick={() => setIsOpen(false)}
                        className="block text-sm text-gray-600 hover:text-blue-600"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="block text-gray-700 hover:text-blue-600 font-medium"
              >
                About
              </Link>

              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="block text-gray-700 hover:text-blue-600 font-medium"
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
