import React, { useState } from "react";
import { authService } from "../services/api";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function LoginPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({
    email: "test@example.com",
    password: "testpassword",
  });
  const [registerData, setRegisterData] = useState({
    storeName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const data = await authService.login(loginData.email, loginData.password);
      onLoginSuccess(data.seller);
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);
    try {
      await authService.register(
        registerData.storeName,
        registerData.email,
        registerData.phoneNumber,
        registerData.password,
      );
      setSuccess("Registration successful! Please log in.");
      setIsLogin(true);
      setLoginData({
        email: registerData.email,
        password: registerData.password,
      });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Registration failed. Email might already be registered.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-lg">
        <div>
          <div className="mx-auto h-12 w-12 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-2xl">
            L
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-on-surface">
            {isLogin ? "Sign in to your store" : "Register your store"}
          </h2>
          <p className="mt-2 text-center text-sm text-on-surface-variant">
            Or{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setSuccess("");
              }}
              className="font-medium text-primary hover:text-primary-container transition-colors"
            >
              {isLogin
                ? "create a new vendor account"
                : "sign in to your existing account"}
            </button>
          </p>
        </div>

        {error && (
          <div
            className="bg-error-container text-on-error-container p-3 rounded-lg text-sm font-medium"
            role="alert"
          >
            {error}
          </div>
        )}

        {success && (
          <div className="bg-[#DCFCE7] text-[#166534] p-3 rounded-lg text-sm font-medium">
            {success}
          </div>
        )}

        {isLogin ? (
          <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
            <div className="space-y-4">
              <Input
                label="Email address"
                name="email"
                type="email"
                required
                value={loginData.email}
                onChange={handleLoginChange}
                placeholder="vendor@example.com"
              />
              <Input
                label="Password"
                name="password"
                type="password"
                required
                value={loginData.password}
                onChange={handleLoginChange}
                placeholder="••••••••"
              />
            </div>

            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-4 text-xs text-on-surface-variant">
              <p className="font-semibold mb-1">Test Account Credentials:</p>
              <p>
                Email: <span className="font-mono">test@example.com</span>
              </p>
              <p>
                Password: <span className="font-mono">testpassword</span>
              </p>
            </div>

            <div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleRegisterSubmit}>
            <div className="space-y-4">
              <Input
                label="Store Name"
                name="storeName"
                type="text"
                required
                value={registerData.storeName}
                onChange={handleRegisterChange}
                placeholder="Apex Laptops"
              />
              <Input
                label="Email address"
                name="email"
                type="email"
                required
                value={registerData.email}
                onChange={handleRegisterChange}
                placeholder="vendor@example.com"
              />
              <Input
                label="Phone Number (Optional)"
                name="phoneNumber"
                type="tel"
                value={registerData.phoneNumber}
                onChange={handleRegisterChange}
                placeholder="+1 (555) 000-0000"
              />
              <Input
                label="Password"
                name="password"
                type="password"
                required
                minLength={6}
                value={registerData.password}
                onChange={handleRegisterChange}
                placeholder="•••••••• (min 6 characters)"
              />
            </div>

            <div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register Store"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
