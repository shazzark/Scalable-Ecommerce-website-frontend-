"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit2, Trash2, Plus, Loader2 } from "lucide-react";
import { ProtectedRoute } from "../../_components/_ui/protected-routes";
import { cartegoryAPI } from "../../_lib/apiService";
import { useToast } from "../../context/toast-context";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const categories = await cartegoryAPI.getAllCategories();
      setCategories(categories);
    } catch (err) {
      console.error("Failed to load categories:", err);
      addToast("Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Delete category
  const deleteCategory = async (id) => {
    try {
      await cartegoryAPI.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      addToast("Category deleted", "success");
    } catch (err) {
      console.error("Failed to delete category:", err);
      addToast("Failed to delete category", "error");
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
          <h2 className="text-3xl font-bold text-slate-900">
            Manage Categories
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition"
          >
            <Plus className="w-5 h-5" /> Add Category
          </motion.button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, idx) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {category.name}
              </h3>

              <p className="text-gray-600 mb-4">
                {category.productsCount ?? 0} products
              </p>

              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
                Active
              </span>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  <Edit2 className="w-5 h-5 mx-auto" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => deleteCategory(category._id)}
                  className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5 mx-auto" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
