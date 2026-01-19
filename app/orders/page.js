"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, DollarSign, MapPin, Loader2 } from "lucide-react";
import { ProtectedRoute } from "../_components/protected-routes";
import { useToast } from "../context/toast-context";
import { orderAPI } from "../_lib/apiService";

export default function OrdersPage() {
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Fetch all orders of this user
        const res = await orderAPI.getMyOrders();
        setOrders(res || []); // <- assign directly
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        addToast("Failed to load orders", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [addToast]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    );
  }

  if (orders.length === 0) {
    return <div className="text-center py-12">No orders found</div>;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              My Orders
            </h1>
            <p className="text-lg text-gray-600">
              Track and manage your orders
            </p>
          </motion.div>

          <div className="space-y-6">
            {orders.map((order, idx) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-lg p-6 border-l-4 border-teal-600"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {order._id}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Ordered on{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <motion.div
                    animate={{
                      backgroundColor:
                        order.orderStatus === "delivered"
                          ? "#10b981"
                          : order.orderStatus === "shipped"
                            ? "#f59e0b"
                            : "#6b7280",
                    }}
                    className="px-4 py-2 text-white rounded-full text-sm font-semibold w-fit"
                  >
                    {order.orderStatus}
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">
                      Items
                    </h4>
                    <ul className="space-y-1">
                      {order.items.map((item) => (
                        <li
                          key={item._id || item.productId}
                          className="text-sm text-gray-700"
                        >
                          • {item.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <h4 className="text-sm font-semibold">Shipping To</h4>
                    </div>
                    <p className="text-sm text-gray-700">
                      {order.shippingAddress?.street},{" "}
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state},{" "}
                      {order.shippingAddress?.zip}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <DollarSign className="w-4 h-4" />
                      <h4 className="text-sm font-semibold">Total</h4>
                    </div>
                    <p className="text-2xl font-bold text-teal-600">
                      ₦{order.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
