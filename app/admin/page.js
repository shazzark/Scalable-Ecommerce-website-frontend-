"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  Loader2,
} from "lucide-react";
import { ProtectedRoute } from "../_components/protected-routes";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useToast } from "../context/toast-context";
import { adminAPI } from "../_lib/apiService";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export default function AdminDashboard() {
  const [STATS, setSTATS] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const data = await adminAPI.getDashboardStats();

        // Overall Stats
        setSTATS([
          {
            label: "Total Sales",
            value: `₦${data.orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString()}`,

            icon: DollarSign,
            color: "from-blue-500 to-blue-600",
          },
          {
            label: "Total Orders",
            value: data.orders.length,
            icon: ShoppingCart,
            color: "from-teal-500 to-teal-600",
          },
          {
            label: "Products",
            value: data.products.length,
            icon: Package,
            color: "from-orange-500 to-orange-600",
          },
          {
            label: "Total Users",
            value: data.users.length,
            icon: Users,
            color: "from-purple-500 to-purple-600",
          },
        ]);

        // Monthly sales
        const monthly = MONTHS.map((month, idx) => {
          const monthSales = data.orders
            .filter((o) => new Date(o.createdAt).getMonth() === idx)
            .reduce((sum, o) => sum + o.total, 0);
          return {
            month,
            sales: monthSales,
            progress: Math.min((monthSales / 5000) * 100, 100),
          };
        });
        setMonthlyData(monthly);

        // Recent orders (last 5)
        setRecentOrders(
          data.orders
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5),
        );

        // Top products by number of sales
        const productSales = {};
        data.orders.forEach((order) => {
          order.items.forEach((item) => {
            if (!item.productId) return; // skip null product
            const id = item.productId._id;
            if (!productSales[id]) {
              productSales[id] = { ...item.productId, count: item.quantity };
            } else {
              productSales[id].count += item.quantity;
            }
          });
        });

        setTopProducts(
          Object.values(productSales)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5),
        );
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        addToast("Failed to load dashboard", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [addToast]);

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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className={`bg-linear-to-r ${stat.color} rounded-lg text-white p-6 shadow-lg`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium">
                      {stat.label}
                    </p>
                    <p className="text-4xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <Icon className="w-12 h-12 opacity-20" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts + Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Sales Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg p-6 shadow"
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Sales This Month
            </h3>
            <div className="space-y-4">
              {monthlyData.map(({ month, sales, progress }) => (
                <div key={month}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      {month}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      ${sales}
                    </span>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.1 }}
                    className="h-2 bg-linear-to-r from-teal-400 to-teal-600 rounded-full"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg p-6 shadow"
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Recent Orders
            </h3>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-semibold text-slate-900">
                    {order._id}
                  </span>
                  <motion.span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold">
                    {order.status}
                  </motion.span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 shadow"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Top Products
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">
                    Image
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">
                    Product
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">
                    Sales
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">
                    Revenue
                  </th>
                </tr>
              </thead>

              <tbody>
                {topProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    {/* Image */}
                    <td className="py-4 px-4">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name || "Product image"}
                          width={40}
                          height={40}
                          className="object-cover rounded"
                          unoptimized
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded text-sm">
                          📦
                        </div>
                      )}
                    </td>

                    {/* Product Name */}
                    <td className="py-4 px-4 text-slate-900 font-medium">
                      {product.name}
                    </td>

                    {/* Sales */}
                    <td className="py-4 px-4 text-gray-600">{product.count}</td>

                    {/* Revenue */}
                    <td className="py-4 px-4 font-semibold text-teal-600">
                      ${product.price * product.count || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
