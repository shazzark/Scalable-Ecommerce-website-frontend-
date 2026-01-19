"use client";

import { useAuth } from "../../_lib/useAuth";
import { motion } from "framer-motion";
import { Bell, Settings } from "lucide-react";

export default function AdminHeader() {
  const { user } = useAuth();

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-600">
          Welcome back, {user?.name || "Administrator"}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <Bell className="w-6 h-6 text-gray-600" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <Settings className="w-6 h-6 text-gray-600" />
        </motion.button>
      </div>
    </div>
  );
}
