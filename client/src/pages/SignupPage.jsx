import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "Jane Doe",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Member",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const fillTestCredentials = () => {
    setFormData({
      full_name: "Test Account",
      email: "test@example.com",
      password: "testpassword",
      confirmPassword: "testpassword",
      role: "Member",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        role: formData.role,
      });
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.detail;
      if (Array.isArray(errorMsg)) {
        setError(errorMsg.map((e) => e.msg).join(", "));
      } else if (typeof errorMsg === "string") {
        setError(errorMsg);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Create Your Account
          </h2>
          <p className="text-slate-600 text-sm mb-4">
            Join TaskFlow to manage team projects, tasks, and analytics.
          </p>

          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 flex justify-between items-center">
            <span>
              Test account: <strong>test@example.com</strong> /{" "}
              <strong>testpassword</strong>
            </span>
            <button
              type="button"
              onClick={fillTestCredentials}
              className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition"
            >
              Fill Sample
            </button>
          </div>

          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-600 p-3 rounded mb-4 text-sm"
              role="alert"
            >
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded mb-4 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                className="w-full p-2.5 border rounded-lg bg-slate-50 focus:bg-white text-sm"
                placeholder="e.g. Jane Doe"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Work Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-2.5 border rounded-lg bg-slate-50 focus:bg-white text-sm"
                placeholder="jane.doe@example.com"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full p-2.5 border rounded-lg bg-slate-50 focus:bg-white text-sm"
                  placeholder="••••••••••••"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full p-2.5 border rounded-lg bg-slate-50 focus:bg-white text-sm"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Role
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full p-2.5 border rounded-lg bg-slate-50 text-sm"
              >
                <option value="Member">Member (Standard Team Role)</option>
                <option value="Admin">Admin (Project & System Lead)</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-4 text-xs text-center text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>

        <div className="bg-slate-900 p-8 text-white flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              TaskFlow Platform
            </span>
            <h3 className="text-xl font-bold mt-2 mb-4">
              Streamline Team Workflows
            </h3>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li>✓ Real-time Task & Project CRUD</li>
              <li>✓ Atomic Bulk Task Status Updates</li>
              <li>✓ Productivity Analytics & Reporting</li>
              <li>✓ Automated High-Priority Escalations</li>
            </ul>
          </div>
          <div className="mt-8 pt-4 border-t border-slate-800 text-xs text-slate-400">
            🔒 Passwords encrypted with Bcrypt before persistence
          </div>
        </div>
      </div>
    </div>
  );
}
