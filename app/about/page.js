"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Users, Award, Globe, Heart } from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: Users,
      title: "50k+ Customers",
      description: "Trusted by thousands of happy customers worldwide",
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "Every product meets our strict quality standards",
    },
    {
      icon: Globe,
      title: "Global Shipping",
      description: "Fast and reliable delivery to 150+ countries",
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "Your satisfaction is our top priority",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold mb-6">About StorePro</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We&apos; re on a mission to provide the best shopping experience
              with quality products and exceptional customer service.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <Icon className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="max-w-3xl"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Our Story
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              StorePro was founded in 2024 with a simple mission: to make online
              shopping easier, faster, and more enjoyable for everyone.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              We started as a small team of passionate individuals who believed
              that e-commerce should be simple, transparent, and
              customer-focused.
            </p>
            <p className="text-lg text-gray-700">
              Today, we serve thousands of customers worldwide and continue to
              expand our product selection and improve our services.
            </p>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-teal-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Start Shopping Today</h2>
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-white text-teal-600 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
