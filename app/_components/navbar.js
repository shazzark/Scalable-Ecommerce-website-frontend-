"use client";

import Link from "next/link";
import { useAuth } from "../_lib/useAuth";
import { useCart } from "../context/cart-context";
import {
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-teal-600"
            >
              StorePro
            </motion.div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/products"
              className="text-gray-700 hover:text-teal-600 transition"
            >
              Products
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-teal-600 transition"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-teal-600 transition"
            >
              Contact
            </Link>
          </div>

          {/* Right Section */}
          {mounted && (
            <div className="flex items-center gap-4">
              <Link href="/cart" className="relative">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-teal-600" />
                  {items.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {items.length}
                    </motion.span>
                  )}
                </motion.div>
              </Link>

              {!user ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-gray-700 hover:text-teal-600 transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-4">
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="text-gray-700 hover:text-teal-600 transition"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="text-gray-700 hover:text-teal-600 transition"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={logout}
                    className="text-gray-700 hover:text-teal-600 transition"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Mobile Hamburger */}
              <button
                className="md:hidden p-2 text-gray-700 hover:text-teal-600"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-2 bg-white border-t border-gray-200">
          <Link
            href="/products"
            className="text-gray-700 hover:text-teal-600 transition"
          >
            Products
          </Link>
          <Link
            href="/about"
            className="text-gray-700 hover:text-teal-600 transition"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-gray-700 hover:text-teal-600 transition"
          >
            Contact
          </Link>
          {!user ? (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 hover:text-teal-600 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-gray-700 hover:text-teal-600 transition"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/profile"
                className="text-gray-700 hover:text-teal-600 transition"
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="text-gray-700 hover:text-teal-600 transition text-left"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
