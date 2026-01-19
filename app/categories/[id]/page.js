"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Loader2 } from "lucide-react";
import { useCart } from "../../context/cart-context";
import { useToast } from "../../context/toast-context";
import { cartegoryAPI } from "../../_lib/apiService"; // your API service
import Image from "next/image";

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.id;
  const { addItem } = useCart();
  const { addToast } = useToast();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategory = async () => {
      setLoading(true);
      try {
        const res = await cartegoryAPI.getCategory(categoryId);
        setCategory(res.data.category);
      } catch (err) {
        console.error("Failed to fetch category:", err);
        addToast("Failed to load products", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId, addToast]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!category) {
    return <div className="text-center py-12">Category not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            {category.name}
          </h1>
          <p className="text-lg text-gray-600">{category.description}</p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.products.map((product, idx) => (
            <motion.div
              key={product._id || product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition"
            >
              <Link href={`/products/${product._id || product.id}`}>
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name || "Product image"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl">📦</div>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/products/${product._id || product.id}`}>
                  <h3 className="font-semibold text-slate-900 hover:text-teal-600 transition line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {Array(5)
                      .fill(null)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i <
                            Math.floor(product.ratingsAverage || product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-slate-900">
                    ${product.price}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      addItem(product);
                      addToast("Added to cart", "success");
                    }}
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
    </div>
  );
}
