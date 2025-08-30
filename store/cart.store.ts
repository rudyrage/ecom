import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
}

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  isOpen: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isOpen: false,

      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const response = await fetch("/api/cart");
          if (response.ok) {
            const cartItems = await response.json();
            set({ items: cartItems });
          }
        } catch (error) {
          console.error("Failed to fetch cart:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (productId: string, quantity = 1) => {
        set({ isLoading: true });
        try {
          const response = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, quantity }),
          });

          if (response.ok) {
            await get().fetchCart();
          }
        } catch (error) {
          console.error("Failed to add item to cart:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (productId: string) => {
        set({ isLoading: true });
        try {
          const response = await fetch("/api/cart", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
          });

          if (response.ok) {
            set((state) => ({
              items: state.items.filter((item) => item.productId !== productId),
            }));
          }
        } catch (error) {
          console.error("Failed to remove item from cart:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (productId: string, quantity: number) => {
        if (quantity <= 0) {
          await get().removeItem(productId);
          return;
        }

        set({ isLoading: true });
        try {
          set((state) => ({
            items: state.items.map((item) =>
              item.productId === productId ? { ...item, quantity } : item
            ),
          }));

          const response = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, quantity }),
          });

          if (!response.ok) {
            await get().fetchCart();
          }
        } catch (error) {
          console.error("Failed to update cart quantity:", error);
          await get().fetchCart();
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) =>
            total +
            Number.parseFloat(item.product.price.toString()) * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-store",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
