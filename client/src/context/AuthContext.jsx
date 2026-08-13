import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../services/api";
import { wsService } from "../services/websocket";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await authApi.getMe();
          setUser(userData);
          wsService.connect(token);
        } catch (err) {
          console.error("Failed to load user info:", err);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    const accessToken = data.access_token;
    localStorage.setItem("token", accessToken);
    setToken(accessToken);
    setUser(data.user);
    wsService.connect(accessToken);
    return data.user;
  };

  const register = async (email, password, role) => {
    const newUser = await authApi.register(email, password, role);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    wsService.disconnect();
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
