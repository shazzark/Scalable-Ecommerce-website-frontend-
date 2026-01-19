"use client";

import { motion } from "framer-motion";
import { User, Mail, MapPin, Edit2 } from "lucide-react";
import { ProtectedRoute } from "../_components/protected-routes";
import { useAuth } from "../_lib/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-8"
          >
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  My Profile
                </h1>
                <p className="text-gray-600">Manage your account settings</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="p-3 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-lg transition"
              >
                <Edit2 className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-linear-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-4xl font-bold text-white">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    {user?.name || "User"}
                  </h2>
                  <p className="text-gray-600">
                    {user?.role === "admin" ? "Administrator" : "Customer"}
                  </p>
                </div>
              </div>

              {/* Account Information */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Account Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-slate-900">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Account Type</p>
                      <p className="font-semibold text-slate-900">
                        {user?.role === "admin"
                          ? "Administrator"
                          : "Regular Customer"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Default Address */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Default Address
                </h3>
                <div className="flex items-start gap-4 bg-gray-50 p-4 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900">
                      123 Main Street
                    </p>
                    <p className="text-gray-600">New York, NY 10001</p>
                    <p className="text-gray-600">United States</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-6 space-y-3">
                <button className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition">
                  Edit Profile
                </button>
                <button className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition">
                  Change Password
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
