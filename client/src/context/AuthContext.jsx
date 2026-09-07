import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        } catch (error) {
          console.error("Failed to verify token:", error);
          logout();
        }
      }
      setLoading(false);
    };
    verifyUser();
  }, [token]);

  const login = async (credentials) => {
    const data = await authAPI.login(credentials);
    const { access_token, user: loggedUser } = data;
    setToken(access_token);
    setUser(loggedUser);
    localStorage.setItem("token", access_token);
    localStorage.setItem("user", JSON.stringify(loggedUser));
    return loggedUser;
  };

  const register = async (userData) => {
    const registeredUser = await authAPI.register(userData);
    // After registration, auto-login or return registered user
    return registeredUser;
  };

  const logout = () => {
    authAPI.logout();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
