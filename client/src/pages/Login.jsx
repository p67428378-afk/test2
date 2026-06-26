import React, { useState } from "react";
import PropTypes from "prop-types";
import { authService } from "../services/api";

export default function Login({ onLoginSuccess }) {
  const [loginId, setLoginId] = useState("testuser");
  const [password, setPassword] = useState("testpassword");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await authService.login(loginId, password);
      localStorage.setItem("token", data.access_token);
      onLoginSuccess(data.user);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Invalid login credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-level-1 p-8 border border-[#E2E8F0]">
        <div className="text-center mb-8">
          <h2 className="text-display-lg-mobile font-display-lg-mobile font-bold text-primary-fixed mb-2">
            HR Portal Login
          </h2>
          <p className="text-body-md font-body-md text-secondary">
            Sign in to manage your leave requests
          </p>
        </div>

        {error && (
          <div
            className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg text-body-md font-body-md"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">
              Login ID
            </label>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-body-md font-body-md focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-shadow"
              placeholder="Enter your Login ID"
              required
            />
          </div>

          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-body-md font-body-md focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-shadow"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-container hover:bg-on-primary-fixed-variant text-white font-semibold py-3 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? "Signing in..." : "Sign In"}</span>
          </button>
        </form>

        <div className="mt-6 p-4 bg-surface-container rounded-lg border border-surface-variant text-center">
          <p className="text-label-sm font-label-sm text-on-surface-variant font-semibold mb-1">
            Test Accounts:
          </p>
          <p className="text-body-md font-body-md text-secondary">
            Employee:{" "}
            <code className="bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0]">
              testuser
            </code>{" "}
            /{" "}
            <code className="bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0]">
              testpassword
            </code>
          </p>
          <p className="text-body-md font-body-md text-secondary mt-1">
            Manager:{" "}
            <code className="bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0]">
              manager
            </code>{" "}
            /{" "}
            <code className="bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0]">
              testpassword
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
};
