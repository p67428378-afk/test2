import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import AdminLoginForm from "../components/admin/AdminLoginForm";
import { authService } from "../services/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (username, password) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      await authService.login(username, password);
      setIsLoading(false);
      navigate("/admin");
    } catch (err) {
      setIsLoading(false);
      if (err.response?.status === 401) {
        setErrorMsg(
          "Invalid admin credentials. Please verify username and password.",
        );
      } else {
        setErrorMsg(
          err.response?.data?.detail ||
            "Authentication failed. Please try again.",
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
        <div className="w-full">
          <AdminLoginForm
            onLogin={handleLogin}
            isLoading={isLoading}
            error={errorMsg}
          />
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>
          © 2026 City Parking Fine Management System — Protected Administration
          Portal
        </p>
      </footer>
    </div>
  );
}
