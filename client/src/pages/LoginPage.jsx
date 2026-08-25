import React from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import AuthForm from "../components/auth/AuthForm";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleAuth = async (type, credentials) => {
    if (type === "login") {
      await authService.login(credentials.email, credentials.password);
      navigate("/");
    } else {
      await authService.signup(credentials.email, credentials.password);
    }
  };

  return <AuthForm onAuthSuccess={handleAuth} />;
}
