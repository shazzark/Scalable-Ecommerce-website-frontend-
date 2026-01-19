"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { cartAPI } from "../_lib/apiService"; // adjust path if needed
import { useAuth } from "../_lib/useAuth"; // import your auth context

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------- UTILS ----------------
  const saveGuestCart = (items) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("guestCart", JSON.stringify(items));
    }
  };

  const loadGuestCart = () => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("guestCart");
    return stored ? JSON.parse(stored) : [];
  };

  // ---------------- CART FETCH ----------------
  const fetchCart = async () => {
    if (!user) {
      // guest cart
      const items = loadGuestCart();
      setCart({
        items,
        totalValue: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
      });
      setLoading(false);
      return;
    }

    // logged-in cart
    try {
      setLoading(true);
      const res = await cartAPI.getCart();
      setCart(res.data.cart);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCart({ items: [], totalValue: 0, totalItems: 0 });
    } finally {
      setLoading(false);
    }
  };

  // ---------------- SYNC GUEST CART AFTER LOGIN ----------------
  useEffect(() => {
    if (!authLoading && user) {
      const syncCart = async () => {
        const guestItems = loadGuestCart();
        if (guestItems.length > 0) {
          for (const item of guestItems) {
            try {
              await cartAPI.addToCart({
                productId: item.productId,
                variant: item.variant,
                quantity: item.quantity,
              });
            } catch (err) {
              console.error("Failed to sync guest item:", err);
            }
          }
          localStorage.removeItem("guestCart");
        }
        fetchCart();
      };

      syncCart();
    } else if (!authLoading) {
      fetchCart(); // guest
    }
  }, [user, authLoading]);

  // ---------------- CART ACTIONS ----------------
  const addItem = async ({
    productId,
    variant = {},
    quantity = 1,
    price = 0,
  }) => {
    if (!user) {
      // guest cart
      const items = loadGuestCart();
      const existingIndex = items.findIndex(
        (i) =>
          i.productId === productId &&
          JSON.stringify(i.variant) === JSON.stringify(variant),
      );

      if (existingIndex > -1) {
        items[existingIndex].quantity += quantity;
      } else {
        items.push({ productId, variant, quantity, price });
      }

      saveGuestCart(items);
      setCart({
        items,
        totalValue: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
      });
    } else {
      // logged-in
      const res = await cartAPI.addToCart({ productId, variant, quantity });
      setCart(res.data.cart);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!user) {
      const items = loadGuestCart().map((item) =>
        item.productId === itemId ? { ...item, quantity } : item,
      );
      saveGuestCart(items);
      setCart({
        items,
        totalValue: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
      });
    } else {
      const res = await cartAPI.updateCartItem(itemId, quantity);
      setCart(res.data.cart);
    }
  };

  const removeItem = async (itemId) => {
    if (!user) {
      const items = loadGuestCart().filter((item) => item.productId !== itemId);
      saveGuestCart(items);
      setCart({
        items,
        totalValue: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
      });
    } else {
      const res = await cartAPI.removeCartItem(itemId);
      setCart(res.data.cart);
    }
  };

  const clearCart = async () => {
    if (!user) {
      localStorage.removeItem("guestCart");
      setCart({ items: [], totalValue: 0, totalItems: 0 });
    } else {
      const res = await cartAPI.clearCart();
      setCart(res.data.cart);
    }
  };

  // ---------------- DERIVED VALUES ----------------
  const items = cart?.items || [];
  const total = cart?.totalValue || 0;
  const totalItems = cart?.totalItems || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        total,
        totalItems,
        loading,
        refreshCart: fetchCart,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ---------------- HOOK ----------------
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
