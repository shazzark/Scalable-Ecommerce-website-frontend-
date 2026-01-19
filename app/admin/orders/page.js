"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Loader2 } from "lucide-react";
import { ProtectedRoute } from "../../_components/_ui/protected-routes";
import { orderAPI } from "../../_lib/apiService";
import { useToast } from "../../context/toast-context";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Fetch all orders (admin)
  const fetchOrders = useCallback(

  async () => {
    setLoading(true);
    try {
      const orders = await orderAPI.getAllOrders();
      setOrders(orders);
    } catch (err) {
      console.error("Failed to load orders:", err);
      addToast("Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]) ;

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  // Update order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, newStatus);

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order,
        ),
      );

      addToast("Order status updated", "success");
    } catch (err) {
      console.error("Failed to update order status:", err);
      addToast("Failed to update order status", "error");
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
        <h2 className="text-3xl font-bold text-slate-900 mb-8">
          Manage Orders
        </h2>

        {/* Orders Table */}
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
                    Order ID
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600">
                    Customer
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600">
                    Total
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600">
                    Date
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {order._id}
                    </td>

                    <td className="py-4 px-6 text-gray-600">
                      {order.userId?.name || "N/A"}
                    </td>

                    <td className="py-4 px-6 font-semibold text-teal-600">
                      ${order.totalAmount}
                    </td>

                    <td className="py-4 px-6 text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-6">
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          updateStatus(order._id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-full text-sm font-semibold border-0 cursor-pointer ${
                          order.orderStatus === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.orderStatus === "shipped"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">In Transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-4 px-6">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Eye className="w-5 h-5" />
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
