"use client";

import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { useEffect } from "react";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    isLoading,
    toggleCart,
    updateQuantity,
    removeItem,
    fetchCart,
    getTotalItems,
    getTotalPrice,
  } = useCartStore();

  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      fetchCart();
    }
  }, [isAuthenticated, isOpen, fetchCart]);

  const handleCheckout = () => {
    toggleCart();
    router.push("/checkout");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={toggleCart}
      />

      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-card shadow-2xl transform transition-transform duration-300 ease-out">
        <div className="flex h-full flex-col">
          <div className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <ShoppingBag className="h-6 w-6" />
                  Shopping Cart
                </h2>
                <p className="text-primary-foreground/80 text-sm mt-1">
                  {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"}{" "}
                  in your cart
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCart}
                className="text-primary-foreground hover:bg-white/20 rounded-full h-10 w-10 p-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-muted/30">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                  <p className="text-muted-foreground">Loading your cart...</p>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                <div className="bg-muted rounded-full p-6 mb-4">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Your cart is empty
                </h3>
                <p className="text-muted-foreground mb-4">
                  Add some products to get started!
                </p>
                <Button onClick={toggleCart} variant="outline">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex gap-4">
                      <div className="relative">
                        <img
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          className="h-20 w-20 rounded-lg object-cover border border-border"
                        />
                        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold">
                          {item.quantity}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-primary font-bold text-lg mb-3">
                          ${item.product.price.toString()}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1
                                )
                              }
                              disabled={isLoading}
                              className="h-8 w-8 p-0 hover:bg-background"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-semibold text-foreground">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                              disabled={isLoading}
                              className="h-8 w-8 p-0 hover:bg-background"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.productId)}
                            disabled={isLoading}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0 rounded-full"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="bg-card border-t border-border p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-border pt-2">
                  <div className="flex justify-between items-center text-xl font-bold text-foreground">
                    <span>Total</span>
                    <span className="text-primary">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                    Processing...
                  </div>
                ) : (
                  "Proceed to Checkout"
                )}
              </Button>

              <Button
                variant="outline"
                onClick={toggleCart}
                className="w-full bg-transparent"
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
