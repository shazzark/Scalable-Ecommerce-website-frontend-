"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";
import { ProtectedRoute } from "../../_components/_ui/protected-routes";
import { Loader2 } from "lucide-react";
import { useToast } from "../../context/toast-context";
import { userAPI } from "../../_lib/apiService";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Fetch users from backend
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const users = await userAPI.getAllUsers();
      setUsers(users);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      addToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const deleteUser = async (id) => {
    try {
      await userAPI.deleteUser(id);
      setUsers(users.filter((u) => u._id !== id));
      addToast("User deleted", "success");
    } catch (err) {
      console.error("Failed to delete user:", err);
      addToast("Failed to delete user", "error");
    }
  };

  const updateRole = async (id, newRole) => {
    try {
      await userAPI.updateUserRole(id, newRole);
      setUsers(users.map((u) => (u._id === id ? { ...u, role: newRole } : u)));
      addToast("Role updated", "success");
    } catch (err) {
      console.error("Failed to update role:", err);
      addToast("Failed to update role", "error");
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
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Manage Users</h2>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600">
                    Name
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600">
                    Email
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600">
                    Role
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600">
                    Joined
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {user.name}
                    </td>
                    <td className="py-4 px-6 text-gray-600">{user.email}</td>
                    <td className="py-4 px-6">
                      <select
                        value={user.role}
                        onChange={(e) => updateRole(user._id, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600"
                      >
                        <option>Customer</option>
                        <option>Admin</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{user.joined}</td>
                    <td className="py-4 px-6 flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit2 className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => deleteUser(user._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
