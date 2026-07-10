import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/api";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Master password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await authService.register(email, password);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          "Failed to create account. Email may already be registered.",
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
          Create your secure master password vault
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#171f33] py-8 px-4 shadow-xl border border-[#3c4a42] sm:rounded-xl sm:px-10">
          {success ? (
            <div className="bg-[#4edea3]/10 border border-[#4edea3]/20 text-[#4edea3] p-4 rounded-lg text-sm text-center space-y-2">
              <span className="material-symbols-outlined text-2xl animate-bounce">
                check_circle
              </span>
              <p className="font-semibold">Vault Created Successfully!</p>
              <p className="text-xs text-[#bbcabf]">
                Redirecting to login page...
              </p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 text-[#ffb4ab] p-3 rounded-lg text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    error
                  </span>
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
                  Master Password (Min 8 chars)
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
                <label className="block text-xs font-semibold text-[#bbcabf] uppercase tracking-wider mb-1">
                  Confirm Master Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                      Creating Vault...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">
                        add_moderator
                      </span>
                      Create Vault
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 border-t border-[#3c4a42] pt-6 text-center">
            <p className="text-xs text-[#bbcabf]">
              Already have a vault?{" "}
              <Link
                to="/login"
                className="text-[#4edea3] hover:underline font-semibold"
              >
                Unlock Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
