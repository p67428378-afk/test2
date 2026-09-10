import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthCard from "../components/auth/AuthCard";

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/builder");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-full py-8 sm:py-12 px-4 flex flex-col items-center justify-center">
      <AuthCard />
    </div>
  );
}
