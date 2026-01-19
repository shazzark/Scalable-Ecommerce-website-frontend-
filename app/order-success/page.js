"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import { useState } from "react";

export default function OrderSuccessPage() {
  const [orderNumber] = useState(
    () => `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center text-white max-w-md"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="mb-8"
        >
          <CheckCircle className="w-24 h-24 mx-auto text-teal-400" />
        </motion.div>

        <h1 className="text-4xl font-bold mb-4">Order Placed Successfully!</h1>

        <p className="text-xl text-gray-300 mb-8">
          Thank you for your purchase. Your order has been confirmed and will be
          processed shortly.
        </p>

        <div className="bg-white/10 backdrop-blur rounded-lg p-6 mb-8 border border-white/20">
          <p className="text-sm text-gray-300 mb-2">Order Number</p>
          <p className="text-2xl font-bold">{orderNumber}</p>
          <p className="text-sm text-gray-300 mt-4">
            You will receive a confirmation email shortly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/orders"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition"
          >
            <ShoppingBag className="w-5 h-5" /> View Orders
          </Link>

          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition"
          >
            <Home className="w-5 h-5" /> Back Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
