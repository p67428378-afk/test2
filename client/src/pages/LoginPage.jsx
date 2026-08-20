import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { authService } from "../services/api";
import Button from "../components/common/Button";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <ShieldCheck className="w-12 h-12 text-[#2663eb]" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#171c29]">
          Sign in to WarrantyTracker
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-[#e3e8f0]">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#707a8c]"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-[#e3e8f0] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2663eb] focus:border-[#2663eb] sm:text-sm bg-[#f2f5fa]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#707a8c]"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-[#e3e8f0] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2663eb] focus:border-[#2663eb] sm:text-sm bg-[#f2f5fa]"
                />
              </div>
            </div>

            <div className="bg-blue-5 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
              <p className="font-semibold">Test account credentials:</p>
              <p className="mt-1">
                Email:{" "}
                <span className="font-mono font-bold">test@example.com</span>
              </p>
              <p>
                Password:{" "}
                <span className="font-mono font-bold">testpassword</span>
              </p>
            </div>

            <div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#707a8c]">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-[#2663eb] hover:text-blue-500"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
