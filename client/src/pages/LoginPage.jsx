import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../services/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.login(email, password);
      const redirect = searchParams.get("redirect") || "/profile";
      navigate(redirect);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/20 shadow-md">
        <div>
          <div className="font-headline-md text-headline-md font-bold text-primary text-center mb-4">
            ChocoFeast
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-on-surface font-headline-sm">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-on-surface-variant font-body-md">
            Or{" "}
            <a
              href="/subscribe"
              className="font-medium text-primary hover:text-primary-container"
            >
              start your chocolate journey today
            </a>
          </p>
        </div>

        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm flex items-center gap-2"
            role="alert"
          >
            <span className="material-symbols-outlined text-base">error</span>
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="email-address"
                className="block font-label-sm text-label-sm text-on-surface mb-1"
              >
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2.5 border border-outline-variant/30 placeholder-outline text-on-surface focus:outline-none focus:ring-primary-container focus:border-primary-container focus:z-10 sm:text-sm"
                placeholder="test@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block font-label-sm text-label-sm text-on-surface mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2.5 border border-outline-variant/30 placeholder-outline text-on-surface focus:outline-none focus:ring-primary-container focus:border-primary-container focus:z-10 sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/10 text-xs text-on-surface-variant space-y-1">
            <p className="font-semibold text-on-surface">
              Test Account Credentials:
            </p>
            <p>
              Email:{" "}
              <code className="font-mono bg-surface-container-lowest px-1 py-0.5 rounded">
                test@example.com
              </code>
            </p>
            <p>
              Password:{" "}
              <code className="font-mono bg-surface-container-lowest px-1 py-0.5 rounded">
                testpassword
              </code>
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-secondary-fixed-dim bg-primary-container hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container transition-all disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
