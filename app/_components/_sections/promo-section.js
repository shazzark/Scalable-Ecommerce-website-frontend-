"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function PromoSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-linear-to-r from-teal-600 to-teal-700 rounded-lg overflow-hidden"
        >
          <div className="relative px-8 py-16 text-white text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <Zap className="w-16 h-16 mx-auto mb-4 opacity-30 absolute left-8 top-8" />
            </motion.div>

            <h2 className="text-4xl font-bold mb-4">Limited Time Offer</h2>
            <p className="text-xl text-teal-100 mb-8">
              Get 30% off on all electronics this week only!
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/products"
                className="inline-block px-8 py-4 bg-white text-teal-600 font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                Shop Electronics
              </Link>
            </motion.div>

            <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-3xl font-bold">02</div>
                <div>Days</div>
              </div>
              <div>
                <div className="text-3xl font-bold">14</div>
                <div>Hours</div>
              </div>
              <div>
                <div className="text-3xl font-bold">47</div>
                <div>Minutes</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
