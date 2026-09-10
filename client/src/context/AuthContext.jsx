import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (token) {
        try {
          const currentUser = await authService.getMe();
          setUser(currentUser);
        } catch (error) {
          console.error("Failed to fetch user on init:", error);
          authService.logout(); // Clean up invalid token
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password, rememberMe) => {
    const data = await authService.login(email, password);
    if (data.access_token) {
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", data.access_token);
      const currentUser = await authService.getMe();
      setUser(currentUser);
    }
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    // Optionally log in the user directly after registration
    if (data.id) {
      await login(userData.email, userData.password, false);
    }
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
