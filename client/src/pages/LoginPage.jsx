import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "test@example.com",
    password: "testpassword",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fillTestCredentials = () => {
    setCredentials({
      username: "test@example.com",
      password: "testpassword",
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(credentials);
      if (res.access_token) {
        localStorage.setItem("token", res.access_token);
        navigate("/dashboard");
      } else {
        setError("Login failed: Token not received");
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (typeof detail === "string") {
        setError(detail);
      } else if (Array.isArray(detail)) {
        setError(detail.map((item) => item.msg).join(", "));
      } else {
        setError("Invalid username or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">
          Log In to TaskFlow
        </h2>
        <p className="text-slate-500 text-sm mb-4">
          Enter your credentials to access your projects and tasks.
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

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email / Username
            </label>
            <input
              type="email"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 focus:bg-white"
              placeholder="user@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 focus:bg-white"
              placeholder="••••••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-xs text-center text-slate-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
