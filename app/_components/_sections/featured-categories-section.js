"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Zap, Heart, Smartphone } from "lucide-react";

export default function FeaturedCategoriesSection() {
  const categories = [
    {
      id: 1,
      name: "Electronics",
      icon: Smartphone,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: 2,
      name: "Fashion",
      icon: ShoppingBag,
      color: "from-pink-500 to-pink-600",
    },
    {
      id: 3,
      name: "Home & Garden",
      icon: Heart,
      color: "from-green-500 to-green-600",
    },
    {
      id: 4,
      name: "Sports & Outdoors",
      icon: Zap,
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Featured Categories
          </h2>
          <p className="text-lg text-gray-600">
            Explore our most popular product categories
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Link href={`/categories/${cat.id}`}>
                  <div
                    className={`bg-linear-to-br ${cat.color} rounded-lg p-8 text-white h-40 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition`}
                  >
                    <Icon className="w-12 h-12 mb-4" />
                    <h3 className="text-xl font-semibold text-center">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
