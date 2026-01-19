"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, Truck, CheckCircle, Loader2 } from "lucide-react";
import Image from "next/image";

import { useCart } from "../context/cart-context";
import { ProtectedRoute } from "../_components/protected-routes";
import { useToast } from "../context/toast-context";
import { orderAPI } from "../_lib/apiService"; // Make sure you have createOrder function here

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { addToast } = useToast();

  const [step, setStep] = useState("shipping");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      if (step === "shipping") {
        // Move to payment step
        addToast("Shipping details saved", "success");
        setStep("payment");
        setLoading(false);
        return;
      }

      // Payment step: create order on backend
      const res = await orderAPI.createOrder({
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        paymentMethod: "card", // hardcoded for now
      });

      if (!res || !res.data) throw new Error("Failed to create order");

      addToast("Order placed successfully 🎉", "success");

      // Clear cart
      clearCart();

      // Redirect to success page
      router.push("/order-success");
    } catch (err) {
      console.error("Order creation failed:", err);
      addToast(err.message || "Failed to place order", "error");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
        <div className="bg-white rounded-lg py-12 px-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">No items in cart</h2>
          <button
            onClick={() => router.push("/products")}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Indicator */}
          <div className="mb-12 flex items-center justify-between">
            {["shipping", "payment"].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <motion.div
                  animate={{
                    backgroundColor:
                      step === s || (step === "payment" && s === "shipping")
                        ? "#14b8a6"
                        : "#e5e7eb",
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                >
                  {s === "shipping" ? (
                    <Truck className="w-5 h-5" />
                  ) : (
                    <CreditCard className="w-5 h-5" />
                  )}
                </motion.div>
                <div className="flex-1 h-1 mx-4 bg-gray-300" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 bg-white rounded-lg p-8"
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-8">
                {step === "shipping"
                  ? "Shipping Address"
                  : "Payment Information"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {step === "shipping" ? (
                  <>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        required
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        required
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="ZIP Code"
                      value={formData.zipCode}
                      onChange={(e) =>
                        setFormData({ ...formData, zipCode: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      value={formData.cardName}
                      onChange={(e) =>
                        setFormData({ ...formData, cardName: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                    <input
                      type="text"
                      placeholder="Card Number"
                      value={formData.cardNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, cardNumber: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={formData.cardExpiry}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cardExpiry: e.target.value,
                          })
                        }
                        required
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        value={formData.cardCVC}
                        onChange={(e) =>
                          setFormData({ ...formData, cardCVC: e.target.value })
                        }
                        required
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>
                  </>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg flex justify-center items-center gap-2 transition disabled:opacity-70"
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {step === "shipping"
                    ? loading
                      ? "Processing..."
                      : "Continue to Payment"
                    : loading
                      ? "Processing..."
                      : "Complete Order"}
                </motion.button>
              </form>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg p-6 h-fit"
            >
              <h3 className="text-xl font-semibold text-slate-900 mb-6">
                Order Summary
              </h3>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div
                    key={item._id || item.productId._id}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-md overflow-hidden bg-gray-100">
                        <Image
                          src={item.productId.images[0]}
                          alt={item.productId.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                          unoptimized
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {item.productId.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold">
                      ₦
                      {(
                        (item.priceAtAdd || item.productId.price || 0) *
                        (item.quantity || 1)
                      ).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>₦{(total * 0.1).toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 mt-4">
                  <span className="font-bold">Total</span>
                  <span className="text-2xl font-bold text-teal-600">
                    ₦{(total * 1.1).toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
