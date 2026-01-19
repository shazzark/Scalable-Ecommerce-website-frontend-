"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Filter, Loader2 } from "lucide-react";
import { useCart } from "../context/cart-context";
import { productAPI, cartegoryAPI } from "../_lib/apiService";
import { useToast } from "../context/toast-context";
import { ProtectedRoute } from "./../_components/_ui/protected-routes";

export default function ProductsPage() {
  const { addItem } = useCart();
  const { addToast } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategory, setLoadingCategory] = useState(false);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // store category _id
  const [sortBy, setSortBy] = useState("popularity");

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await cartegoryAPI.getAllCategories();
        setCategories(cats || []);
      } catch (err) {
        console.error(err);
        addToast("Failed to load categories", "error");
      }
    };
    fetchCategories();
  }, [addToast]);

  // Fetch products on mount and when selectedCategory changes
  // In your ProductsPage component:
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingCategory(true);
      try {
        let params = {};
        if (selectedCategory) {
          params.cartegory = selectedCategory;
        }

        const data = await productAPI.getAllProducts(params);
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        addToast("Failed to load products", "error");
        setProducts([]);
      } finally {
        setLoadingCategory(false);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, addToast]);
  // Apply sorting
  let filteredProducts = [...products];
  if (sortBy === "price-low")
    filteredProducts.sort((a, b) => a.price - b.price);
  if (sortBy === "price-high")
    filteredProducts.sort((a, b) => b.price - a.price);
  if (sortBy === "rating")
    filteredProducts.sort(
      (a, b) => (b.ratingsAverage || 0) - (a.ratingsAverage || 0),
    );

  if (loading || loadingCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    );
  }

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
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Our Products
            </h1>
            <p className="text-lg text-gray-600">
              Discover our complete collection of premium products
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 bg-white p-6 rounded-lg h-fit"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" /> Filters
              </h3>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-slate-900 mb-3">Category</h4>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="category"
                    value="all"
                    checked={selectedCategory === null}
                    onChange={() => setSelectedCategory(null)}
                  />
                  <span className="capitalize">All</span>
                </label>
                {categories.map((cat) => (
                  <label key={cat._id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="category"
                      value={cat._id}
                      checked={selectedCategory === cat._id}
                      onChange={() => setSelectedCategory(cat._id)}
                    />
                    <span className="capitalize">{cat.name}</span>
                  </label>
                ))}
              </div>

              {/* Sorting */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="popularity">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </motion.div>

            {/* Products Grid */}
            <motion.div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    No products found
                  </div>
                )}
                {filteredProducts.map((product, idx) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -8 }}
                    className="bg-white rounded-lg shadow hover:shadow-xl"
                  >
                    <Link href={`/products/${product._id}`}>
                      <div className="relative h-48 bg-gray-200">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images?.[0] || "/placeholder.png"}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                            // unoptimized
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-4xl">
                            📦
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-4">
                      <h3 className="font-semibold">{product.name}</h3>
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
                      <div className="flex justify-between items-center mt-3">
                        <span className="font-bold">
                          ₦{product.price.toLocaleString()}
                        </span>
                        <button
                          onClick={() => {
                            addItem({
                              productId: product._id,
                              variant: {},
                              quantity: 1,
                              price: product.price,
                            });
                            addToast("Added to cart", "success");
                          }}
                          className="bg-teal-600 text-white p-2 rounded-lg"
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
