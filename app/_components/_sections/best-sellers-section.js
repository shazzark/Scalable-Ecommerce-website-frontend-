"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Loader2 } from "lucide-react";

import { productAPI } from "../../_lib/apiService";
import { useCart } from "../../context/cart-context";
import { useToast } from "../../context/toast-context";
import { ProtectedRoute } from "../protected-routes";

export default function BestSellersSection() {
  const { addItem } = useCart();
  const { addToast } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);

        // Example: limit + sort (adjust to your backend logic)
        const res = await productAPI.getAllProducts({
          limit: 4,
          sort: "-ratingsAverage",
        });

        setProducts(res ?? []);
      } catch (error) {
        addToast(error.message || "Failed to load best sellers", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, [addToast]);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </section>
    );
  }

  return (
    <ProtectedRoute>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Best Sellers
            </h2>
            <p className="text-lg text-gray-600">
              Most loved products by our customers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, idx) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition"
              >
                <Link href={`/products/${product._id}`}>
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <Image
                      src={product.images?.[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover hover:scale-110 transition duration-300"
                      unoptimized
                    />
                  </div>
                </Link>

                <div className="p-4">
                  <Link href={`/products/${product._id}`}>
                    <h3 className="font-semibold text-slate-900 mb-2 hover:text-teal-600 transition line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {Array(5)
                        .fill(null)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.ratingsAverage || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({product.ratingsQuantity || 0})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-slate-900">
                      ₦{product.price}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        addItem({
                          productId: product._id,
                          quantity: 1,
                        })
                      }
                      className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-lg transition"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
