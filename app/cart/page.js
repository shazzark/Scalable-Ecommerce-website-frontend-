"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "../context/cart-context";
import { ProtectedRoute } from "../_components/protected-routes";
import Image from "next/image";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Shopping Cart
            </h1>
            <p className="text-lg text-gray-600">
              {items.length} item(s) in cart
            </p>
          </motion.div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                Your cart is empty
              </h2>
              <Link
                href="/products"
                className="inline-block px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition"
              >
                Continue Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item, idx) => {
                  const itemPrice = item.price || item.priceAtAdd || 0;

                  return (
                    <motion.div
                      key={
                        item._id ||
                        `${item.productId}-${JSON.stringify(item.variant)}`
                      }
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white rounded-lg p-6 flex gap-6"
                    >
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                        {item.productId?.images?.[0] ? (
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                            <Image
                              src={item.productId.images[0]}
                              alt={item.productId.name}
                              fill
                              className="object-cover"
                              sizes="96px" // matches w-24 = 96px
                              unoptimized // optional, remove if you want Next.js optimization
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                            <div className="text-4xl">📦</div>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-2">
                          {item.productId.name}
                        </h3>
                        <p className="text-gray-600 mb-4">${itemPrice}</p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity - 1)
                              }
                              className="px-3 py-2 hover:bg-gray-100 transition"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity + 1)
                              }
                              className="px-3 py-2 hover:bg-gray-100 transition"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => removeItem(item._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Total Price */}
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">
                          ${(itemPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg p-6 h-fit"
              >
                <h3 className="text-xl font-semibold text-slate-900 mb-6">
                  Order Summary
                </h3>
                <div className="space-y-4 mb-6 border-b border-gray-200 pb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">
                      ${(total * 0.1).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between mb-6">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-teal-600">
                    ${(total * 1.1).toFixed(2)}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  className="block w-full text-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={clearCart}
                  className="w-full mt-3 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition"
                >
                  Clear Cart
                </button>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
