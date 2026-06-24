import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Library, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { authService } from "../services/api";
import { AuthContext } from "../main";

const LoginPage = () => {
  const { login } = React.useContext(AuthContext);
  const navigate = useNavigate();

  // Pre-fill with test credentials as mandated by instructions
  const [username, setUsername] = React.useState("test@example.com");
  const [password, setPassword] = React.useState("testpassword");
  const [isLibrarian, setIsLibrarian] = React.useState(true);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    try {
      const data = await authService.login(username, password, isLibrarian);
      setSuccess("Login successful! Redirecting...");

      setTimeout(() => {
        login({
          username,
          role: data.role || (isLibrarian ? "librarian" : "patron"),
        });
        if (isLibrarian) {
          navigate("/");
        } else {
          navigate("/opac");
        }
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Invalid credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10 space-y-8">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl bg-indigo-600 items-center justify-center text-white shadow-lg shadow-indigo-600/20 mb-2">
            <Library className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Welcome to LibSphere
          </h2>
          <p className="text-slate-400 text-sm">
            Sign in to access the library management console.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Username / Email
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 absolute left-3 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="test@example.com"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 absolute left-3 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                />
              </div>
            </div>

            {/* Role Toggle */}
            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLibrarian}
                  onChange={(e) => setIsLibrarian(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                />
                <span className="text-sm text-slate-300">
                  Sign in as Librarian
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold rounded-lg transition-colors text-sm shadow-lg shadow-indigo-600/10"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Test Credentials Note */}
          <div className="p-4 bg-slate-950/50 border border-slate-800/50 rounded-xl text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Test Credentials:</p>
            <p>
              Username:{" "}
              <span className="font-mono text-indigo-400">
                test@example.com
              </span>
            </p>
            <p>
              Password:{" "}
              <span className="font-mono text-indigo-400">testpassword</span>
            </p>
          </div>
        </div>

        {/* Public Catalog Link */}
        <div className="text-center">
          <Link
            to="/opac"
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          >
            ← Back to Public Catalog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
