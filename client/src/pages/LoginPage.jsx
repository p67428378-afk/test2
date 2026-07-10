import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/api";

const LoginPage = () => {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.login(email, password);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || "Invalid email or master password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1326] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-[#4edea3]/30 selection:text-[#4edea3]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-12 h-12 bg-[#4edea3] rounded-xl flex items-center justify-center text-[#003824] font-bold mb-4 shadow-lg">
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            security
          </span>
        </div>
        <h2 className="text-3xl font-bold text-[#4edea3] tracking-tight">
          ShieldVault
        </h2>
        <p className="mt-2 text-sm text-[#bbcabf]">
          Secure Enterprise Password Manager
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#171f33] py-8 px-4 shadow-xl border border-[#3c4a42] sm:rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 text-[#ffb4ab] p-3 rounded-lg text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#bbcabf] uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0b1326] border border-[#3c4a42] rounded-lg p-2.5 text-sm text-[#dae2fd] focus:outline-none focus:border-[#4edea3] focus:ring-1 focus:ring-[#4edea3]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#bbcabf] uppercase tracking-wider mb-1">
                Master Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0b1326] border border-[#3c4a42] rounded-lg p-2.5 text-sm text-[#dae2fd] focus:outline-none focus:border-[#4edea3] focus:ring-1 focus:ring-[#4edea3]"
                placeholder="••••••••"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4edea3] text-[#003824] font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">
                      sync
                    </span>
                    Unlocking Vault...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">
                      lock_open
                    </span>
                    Unlock Vault
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-[#3c4a42] pt-6 text-center">
            <p className="text-xs text-[#bbcabf]">
              Don't have a vault yet?{" "}
              <Link
                to="/register"
                className="text-[#4edea3] hover:underline font-semibold"
              >
                Create Account
              </Link>
            </p>
          </div>

          {/* Test Credentials Note */}
          <div className="mt-6 bg-[#0b1326] border border-[#3c4a42] rounded-lg p-3 text-xs text-[#bbcabf]">
            <p className="font-semibold text-[#4edea3] mb-1">Demo Account:</p>
            <p>
              Email: <code className="text-[#dae2fd]">test@example.com</code>
            </p>
            <p>
              Password: <code className="text-[#dae2fd]">testpassword</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
