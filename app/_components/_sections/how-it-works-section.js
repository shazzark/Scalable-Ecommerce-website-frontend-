"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Truck, CheckCircle } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      icon: ShoppingBag,
      title: "Browse & Shop",
      description: "Explore our wide selection of quality products",
    },
    {
      icon: Truck,
      title: "Fast Shipping",
      description: "Get your order delivered within 3-5 business days",
    },
    {
      icon: CheckCircle,
      title: "Quality Guaranteed",
      description: "100% satisfaction guarantee on all purchases",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600">
            Simple, secure, and fast shopping experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="relative"
              >
                {/* Connector line */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-teal-300 -z-10" />
                )}

                <div className="flex flex-col items-center text-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-24 h-24 bg-teal-600 rounded-full flex items-center justify-center mb-6 relative z-10"
                  >
                    <Icon className="w-12 h-12 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
