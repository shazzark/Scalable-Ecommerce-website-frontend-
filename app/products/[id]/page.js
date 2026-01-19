"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingCart, Star, ArrowLeft, Heart, Loader2 } from "lucide-react";

import { productAPI } from "../../_lib/apiService";
import { useCart } from "../../context/cart-context";
import { useToast } from "../../context/toast-context";
import Image from "next/image";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productAPI.getProduct(id);
        setProduct(res.data.product);
      } catch (error) {
        addToast(error.message || "Failed to load product", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, addToast]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/products"
          className="flex items-center gap-2 text-teal-600 mb-8"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative bg-gray-100 rounded-lg h-96 overflow-hidden">
            <Image
              src={product.images?.[0] || product.image || "/placeholder.png"}
              alt={product.name}
              fill
              priority
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex">
                {Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.ratingsAverage || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
              </div>
              <span className="text-gray-600">
                ({product.ratingsQuantity || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="text-4xl font-bold mb-6">₦{product.price}</div>

            {/* Description */}
            <p className="text-gray-700 mb-6">{product.description}</p>

            {/* Specs (optional) */}
            {Array.isArray(product.specs) && (
              <div className="mb-8">
                <h3 className="font-semibold mb-4">Specifications</h3>
                <ul className="space-y-2">
                  {product.specs.map((spec) => (
                    <li key={spec} className="flex gap-2">
                      <span className="w-2 h-2 bg-teal-600 rounded-full mt-2" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2"
                >
                  -
                </button>
                <span className="px-4 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-2"
                >
                  +
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  addItem({
                    productId: product._id,
                    quantity,
                  })
                }
                className="flex-1 bg-teal-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLiked((v) => !v)}
                className={`px-6 py-3 rounded-lg ${
                  liked ? "bg-red-50 text-red-600" : "bg-gray-100"
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? "fill-red-600" : ""}`} />
              </motion.button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-sm">
              ✓ 100% authentic · ✓ 30-day returns · ✓ Fast delivery
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
