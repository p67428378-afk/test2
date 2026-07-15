import React, { useState } from "react";
import RegistrationForm from "../components/visitor/RegistrationForm";
import CalendarScheduler from "../components/visitor/CalendarScheduler";
import { authService, appointmentService } from "../services/api";

export default function VisitorPage() {
  const [isLoggedIn, setIsSelectedLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (userData) => {
    try {
      await authService.register(userData);
      setSuccess(
        "Registration successful! Please log in with your credentials.",
      );
      setShowLogin(true);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const data = await authService.login({ email, password });
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);
      setIsSelectedLoggedIn(true);
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed.");
    }
  };

  const handleSchedule = async (appointmentData) => {
    return await appointmentService.create(appointmentData);
  };

  return (
    <div className="max-w-container-max w-full mx-auto flex flex-col lg:flex-row gap-gutter p-6">
      {isLoggedIn ? (
        <div className="w-full">
          <div className="flex justify-between items-center mb-6 bg-surface-container p-4 rounded-xl border border-surface-variant">
            <div>
              <h2 className="text-xl font-bold text-on-surface">
                Welcome Back, Visitor
              </h2>
              <p className="text-sm text-on-surface-variant">
                You are logged in and verified.
              </p>
            </div>
            <button
              onClick={() => {
                localStorage.clear();
                setIsSelectedLoggedIn(false);
              }}
              className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90"
            >
              Logout
            </button>
          </div>
          <CalendarScheduler onSubmitRequest={handleSchedule} />
        </div>
      ) : showLogin ? (
        <div className="max-w-md w-full mx-auto bg-surface-container p-8 rounded-xl border border-surface-variant shadow-lg">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">
            Visitor Login
          </h2>
          {error && (
            <div className="mb-4 p-3 bg-error-container border border-error text-on-error-container rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-[#132d20] border border-[#1f4a35] text-[#4ade80] rounded-lg text-sm">
              {success}
            </div>
          )}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label
                className="text-sm text-on-surface-variant"
                htmlFor="loginEmail"
              >
                Email
              </label>
              <input
                id="loginEmail"
                type="email"
                className="bg-surface-container-high border border-outline-variant text-on-surface rounded-lg p-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                className="text-sm text-on-surface-variant"
                htmlFor="loginPassword"
              >
                Password
              </label>
              <input
                id="loginPassword"
                type="password"
                className="bg-surface-container-high border border-outline-variant text-on-surface rounded-lg p-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-[#6366f1] text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 mt-2"
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setShowLogin(false)}
              className="text-primary text-sm hover:underline mt-2 bg-transparent border-none"
            >
              Need an account? Register here
            </button>
          </form>
        </div>
      ) : (
        <div className="w-full flex flex-col lg:flex-row gap-gutter">
          <div className="lg:w-[45%]">
            <RegistrationForm
              onRegisterSuccess={handleRegister}
              onToggleLogin={() => setShowLogin(true)}
            />
          </div>
          <div className="lg:w-[55%] bg-surface-container p-8 rounded-xl border border-surface-variant flex flex-col justify-center items-center text-center shadow-lg">
            <span className="text-6xl mb-4">🔒</span>
            <h2 className="text-2xl font-bold text-on-surface mb-2">
              Secure Visitor Portal
            </h2>
            <p className="text-on-surface-variant max-w-md">
              Please register and verify your identity online to schedule visits
              with inmates. All visits are subject to approval and security
              logging.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
