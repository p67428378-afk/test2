import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Key, Mail, ShieldAlert } from "lucide-react";
import { authService } from "../services/api";
import Field from "../components/common/Field";
import Button from "../components/common/Button";

export default function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await authService.login(email, password);
      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      const detail =
        err.response?.data?.detail ||
        "Failed to connect to backend server. Ensure backend is running.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  const setPresetCredentials = (userEmail, userPass) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-[#e0e8f0] shadow-md space-y-6">
        <div className="text-center">
          <div className="text-4xl mb-2">🏥</div>
          <h2 className="text-2xl font-bold text-[#171f2e] tracking-tight">
            MedCare HMS Portal
          </h2>
          <p className="text-sm text-[#6b7a8f] mt-1">
            Sign in to access patient records, appointments & billing
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-[#db2727] text-xs p-3 rounded-lg flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field
            label="Email Address"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. receptionist@example.com"
            required
          />

          <Field
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full py-2.5 mt-2"
            icon={LogIn}
          >
            {loading ? "Authenticating..." : "Sign In to HMS"}
          </Button>
        </form>

        {/* Test Accounts Info Panel (Mandatory per Constitution & Test Guidelines) */}
        <div className="pt-4 border-t border-[#e0e8f0]">
          <p className="text-xs font-semibold text-[#171f2e] mb-2 flex items-center gap-1">
            <Key className="w-3.5 h-3.5 text-[#1485b8]" />
            <span>Quick Login Presets (Test Accounts)</span>
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() =>
                setPresetCredentials("test@example.com", "testpassword")
              }
              className="p-2 border border-[#e0e8f0] rounded hover:bg-slate-50 text-left transition-colors"
            >
              <div className="font-semibold text-[#171f2e]">Receptionist</div>
              <div className="text-[11px] text-[#6b7a8f] truncate">
                test@example.com
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                setPresetCredentials("admin@example.com", "adminpassword")
              }
              className="p-2 border border-[#e0e8f0] rounded hover:bg-slate-50 text-left transition-colors"
            >
              <div className="font-semibold text-[#171f2e]">Administrator</div>
              <div className="text-[11px] text-[#6b7a8f] truncate">
                admin@example.com
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                setPresetCredentials("doctor@example.com", "doctorpassword")
              }
              className="p-2 border border-[#e0e8f0] rounded hover:bg-slate-50 text-left transition-colors col-span-2"
            >
              <div className="font-semibold text-[#171f2e]">
                Doctor (Dr. John Smith)
              </div>
              <div className="text-[11px] text-[#6b7a8f] truncate">
                doctor@example.com
              </div>
            </button>
          </div>
          <p className="text-[11px] text-[#6b7a8f] mt-2 italic text-center">
            Test account: test@example.com / testpassword
          </p>
        </div>
      </div>
    </div>
  );
}
