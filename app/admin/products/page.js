"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Edit2, Trash2, Plus } from "lucide-react";
import { ProtectedRoute } from "../../_components/protected-routes";
import { Loader2 } from "lucide-react";
import { useToast } from "../../context/toast-context";
import { productAPI } from "../../_lib/apiService";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Fetch products from backend
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const products = await productAPI.getAllProducts();
      // Assuming API returns { data: products }
      setProducts(products);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      addToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  const deleteProduct = async (id) => {
    try {
      await productAPI.deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
      addToast("Product deleted", "success");
    } catch (err) {
      console.error("Failed to delete product:", err);
      addToast("Failed to delete product", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Manage Products</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition"
          >
            <Plus className="w-5 h-5" /> Add Product
          </motion.button>
        </div>

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600">
                    Product Name
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600">
                    Category
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600">
                    Price
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600">
                    Stock
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, idx) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-6 text-slate-900 font-medium">
                      {product.name}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {product.category?.name || "N/A"}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      ${product.price}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          product.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit2 className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => deleteProduct(product._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
