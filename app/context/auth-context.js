"use client";

import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "../_lib/apiService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // optional, for showing a toast later

  const isAuthenticated = !!user;

  // Fetch current user on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await authAPI.getCurrentUser();
        setUser(data.data.user);
      } catch (err) {
        console.warn("Failed to fetch current user:", err.message);
        // Only set user to null if unauthorized, otherwise keep previous user
        if (err.status === 401) {
          setUser(null);
        }
        // Optionally store error to show a toast
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authAPI.login(email, password);

      localStorage.setItem("token", data.token); // optional
      setUser(data.data.user);

      return data;
    } catch (err) {
      // Throw a clearer message if password is incorrect
      const message = err?.response?.data?.message || "Password is not correct";
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await authAPI.register({
        name,
        email,
        password,
        passwordConfirm,
      });
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    router.push("/login");
    authAPI.logout().catch((err) => console.error("Logout failed:", err));
  };

  const canAccess = (requiredRole = null) => {
    if (!user) return false;
    if (!requiredRole) return true;
    return user.role === requiredRole;
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    error, // optional
    login,
    register,
    logout,
    canAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
