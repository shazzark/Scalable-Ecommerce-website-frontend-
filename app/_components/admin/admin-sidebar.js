"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Grid3x3,
  ShoppingCart,
  Users,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../_lib/useAuth";

const ADMIN_LINKS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Grid3x3 },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Users", href: "/admin/users", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <Link href="/admin" className="text-2xl font-bold text-teal-400">
          StorePro
        </Link>
        <p className="text-sm text-gray-400 mt-2">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {ADMIN_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link key={link.href} href={link.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-teal-600 text-white"
                    : "text-gray-300 hover:bg-slate-800"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={logout}
        className="m-4 flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition text-white font-semibold"
      >
        <LogOut className="w-5 h-5" /> Logout
      </motion.button>
    </div>
  );
}
