const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

const apiFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const isAuthEndpoint =
    endpoint.includes("/login") || endpoint.includes("/signup");

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && !isAuthEndpoint ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    credentials: "include", // IMPORTANT for cookies
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `HTTP ${response.status}`,
      response.status,
    );
  }

  return response.json();
};

export const authAPI = {
  login: async (email, password) => {
    return apiFetch("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (userData) => {
    return apiFetch("/users/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  logout: async () => {
    return apiFetch("/users/logout", {
      method: "POST",
    });
  },

  getCurrentUser: async () => {
    return apiFetch("/users/me"); // cookie automatically sent
  },

  updateProfile: async (userData) => {
    return apiFetch("/users/me", {
      method: "PATCH",
      body: JSON.stringify(userData),
    });
  },

  updatePassword: async (currentPassword, newPassword, newPasswordConfirm) => {
    return apiFetch("/users/updateMyPassword", {
      method: "PATCH",
      body: JSON.stringify({
        passwordCurrent: currentPassword,
        password: newPassword,
        passwordConfirm: newPasswordConfirm,
      }),
    });
  },

  forgotPassword: async (email) => {
    return apiFetch("/users/forgotPassword", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token, passwords) => {
    return apiFetch(`/users/resetPassword/${token}`, {
      method: "PATCH",
      body: JSON.stringify(passwords),
    });
  },
};

// ==================== PRODUCTS ====================
export const productAPI = {
  getAllProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `/products${queryString ? `?${queryString}` : ""}`;

    const res = await apiFetch(url);
    return res.data.products;
  },

  searchProducts: async (query) => {
    return apiFetch(`/products/search?q=${query}`);
  },

  getProduct: async (productId) => {
    return apiFetch(`/products/${productId}`);
  },

  getProductsByCategory: async (categoryId) => {
    const res = await apiFetch(`/products/category/${categoryId}`);
    return res.data.products;
  },

  // Admin only
  createProduct: async (productData) => {
    // For FormData (images), use fetch directly
    const token = getAuthToken();
    const formData = new FormData();

    // Append product fields
    Object.keys(productData).forEach((key) => {
      if (key === "images" && Array.isArray(productData[key])) {
        productData[key].forEach((file) => formData.append("images", file));
      } else if (key === "variants") {
        formData.append(key, JSON.stringify(productData[key]));
      } else {
        formData.append(key, productData[key]);
      }
    });

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP ${response.status}`,
        response.status,
      );
    }

    return response.json();
  },

  updateProduct: async (productId, productData) => {
    return apiFetch(`/products/${productId}`, {
      method: "PATCH",
      body: JSON.stringify(productData),
    });
  },

  deleteProduct: async (productId) => {
    return apiFetch(`/products/${productId}`, {
      method: "DELETE",
    });
  },
};

// ==================== CATEGORIES ====================
export const cartegoryAPI = {
  getAllCategories: async () => {
    const res = await apiFetch("/cartegories");
    return res.data.categories;
  },

  getCategory: async (categoryId) => {
    return apiFetch(`/cartegories/${categoryId}`);
  },

  getSubcategories: async (categoryId) => {
    return apiFetch(`/cartegories/${categoryId}/subcategories`);
  },

  // Admin only
  createCategory: async (categoryData) => {
    return apiFetch("/cartegories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  },

  updateCategory: async (categoryId, categoryData) => {
    return apiFetch(`/cartegories/${categoryId}`, {
      method: "PATCH",
      body: JSON.stringify(categoryData),
    });
  },

  deleteCategory: async (categoryId) => {
    return apiFetch(`/cartegories/${categoryId}`, {
      method: "DELETE",
    });
  },
};

// ==================== CART ====================
export const cartAPI = {
  getCart: async () => {
    return apiFetch("/cart");
  },

  addToCart: async (itemData) => {
    return apiFetch("/cart/add", {
      method: "POST",
      body: JSON.stringify(itemData),
    });
  },

  updateCartItem: async (itemId, quantity) => {
    return apiFetch(`/cart/item/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    });
  },

  removeCartItem: async (itemId) => {
    return apiFetch(`/cart/item/${itemId}`, {
      method: "DELETE",
    });
  },

  clearCart: async () => {
    return apiFetch("/cart/clear", {
      method: "DELETE",
    });
  },
};

// ==================== ORDERS ====================
export const orderAPI = {
  createOrder: async (orderData) => {
    return apiFetch("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  },

  getMyOrders: async () => {
    const res = await apiFetch("/orders/my-orders");
    return res.data.orders;
  },

  getOrder: async (orderId) => {
    return apiFetch(`/orders/${orderId}`);
  },

  cancelOrder: async (orderId) => {
    return apiFetch(`/orders/${orderId}/cancel`, {
      method: "PATCH",
    });
  },

  getOrderStats: async () => {
    return apiFetch("/orders/stats");
  },

  // Admin only
  getAllOrders: async () => {
    const res = await apiFetch("/orders");
    return res.data.orders;
  },

  updateOrderStatus: async (orderId, orderStatus) => {
    return apiFetch(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ orderStatus }),
    });
  },
};

// ==================== PAYMENTS ====================
export const paymentAPI = {
  initializePaystack: async (paymentData) => {
    return apiFetch("/payments/paystack/initialize", {
      method: "POST",
      body: JSON.stringify(paymentData),
    });
  },

  verifyPaystack: async (reference) => {
    return apiFetch(`/payments/verify-paystack?reference=${reference}`);
  },

  getPayment: async (paymentId) => {
    return apiFetch(`/payments/${paymentId}`);
  },

  // Admin only
  getAllPayments: async () => {
    return apiFetch("/payments");
  },

  refundPayment: async (paymentId, reason) => {
    return apiFetch(`/payments/${paymentId}/refund`, {
      method: "POST",
      body: JSON.stringify({ refundReason: reason }),
    });
  },

  // Webhook (for Paystack callbacks)
  handlePaystackWebhook: async (webhookData) => {
    return apiFetch("/payments/paystack-webhook", {
      method: "POST",
      body: JSON.stringify(webhookData),
    });
  },
};

// ==================== USERS (Admin only) ====================
export const userAPI = {
  getAllUsers: async () => {
    const res = await apiFetch("/users");
    return res.data.users;
  },

  getUser: async (userId) => {
    return apiFetch(`/users/${userId}`);
  },

  updateUser: async (userId, userData) => {
    return apiFetch(`/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(userData),
    });
  },

  deleteUser: async (userId) => {
    return apiFetch(`/users/${userId}`, {
      method: "DELETE",
    });
  },
};

// ==================== ADMIN DASHBOARD ====================
export const adminAPI = {
  getDashboardStats: async () => {
    // You can create a dedicated endpoint for dashboard stats
    const [orders, payments, products, users] = await Promise.all([
      orderAPI.getAllOrders(),
      paymentAPI.getAllPayments(),
      productAPI.getAllProducts(),
      userAPI.getAllUsers(),
    ]);

    return {
      orders: orders ?? [],
      payments: payments ?? [],
      products: products ?? [],
      users: users ?? [],
    };
  },
};

// Export all APIs in one object
export const apiService = {
  auth: authAPI,
  products: productAPI,
  cartegories: cartegoryAPI,
  cart: cartAPI,
  orders: orderAPI,
  payments: paymentAPI,
  users: userAPI,
  admin: adminAPI,
};

export default apiService;
