"use client"

import { useCartStore } from "@/store/cart.store"
import { useAuthStore } from "@/store/auth.store"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function CartIcon() {
  const { toggleCart, getTotalItems, fetchCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  const totalItems = getTotalItems()

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
    }
  }, [isAuthenticated, fetchCart])

  if (!isAuthenticated) return null

  return (
    <Button variant="ghost" size="sm" onClick={toggleCart} className="relative">
      <ShoppingBag className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Button>
  )
}
