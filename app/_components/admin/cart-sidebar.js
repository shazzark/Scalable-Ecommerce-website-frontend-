"use client";

import Link from "next/link";
import { useCart } from "../../context/cart-context";

export default function CartSidebar() {
  const { items, removeItem, updateQuantity } = useCart();

  return (
    <div className="bg-white border-l border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4">Cart Summary</h3>
      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <span className="text-sm">{item.name}</span>
              <span className="font-semibold">${item.price}</span>
            </div>
          ))}
          <Link
            href="/cart"
            className="block w-full text-center px-4 py-2 bg-teal-600 text-white rounded"
          >
            View Cart
          </Link>
        </div>
      )}
    </div>
  );
}
