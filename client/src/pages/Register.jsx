import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("buyer"); // 'buyer' or 'broker'
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [brokerLicense, setBrokerLicense] = useState("");
  const [brokerAgency, setBrokerAgency] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const payload = {
      email,
      password,
      role,
      full_name: fullName,
      phone: phone || null,
      broker_license: role === "broker" ? brokerLicense : null,
      broker_agency: role === "broker" ? brokerAgency : null,
    };

    try {
      await authService.register(payload);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-8 w-full max-w-md flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <p className="text-sm text-[#bbcabf] mt-1">
            Join BrokerHaven real estate platform
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex bg-[#0f172a] p-1 rounded-lg border border-[#334155]">
          <button
            type="button"
            onClick={() => setRole("buyer")}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
              role === "buyer"
                ? "bg-[#10b981] text-[#0F172A]"
                : "text-[#bbcabf] hover:text-white"
            }`}
          >
            Buyer
          </button>
          <button
            type="button"
            onClick={() => setRole("broker")}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
              role === "broker"
                ? "bg-[#10b981] text-[#0F172A]"
                : "text-[#bbcabf] hover:text-white"
            }`}
          >
            Broker
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-[#ffb4ab] p-3 rounded-lg text-xs text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-[#10b981]/10 border border-[#10b981]/30 text-[#4edea3] p-3 rounded-lg text-xs text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg text-sm px-3 py-2 bg-[#0f172a] border border-[#334155] text-white"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg text-sm px-3 py-2 bg-[#0f172a] border border-[#334155] text-white"
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg text-sm px-3 py-2 bg-[#0f172a] border border-[#334155] text-white"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg text-sm px-3 py-2 bg-[#0f172a] border border-[#334155] text-white"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          {/* Broker Specific Fields */}
          {role === "broker" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Broker License Number
                </label>
                <input
                  type="text"
                  value={brokerLicense}
                  onChange={(e) => setBrokerLicense(e.target.value)}
                  className="w-full rounded-lg text-sm px-3 py-2 bg-[#0f172a] border border-[#334155] text-white"
                  placeholder="LIC-12345678"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Broker Agency Name
                </label>
                <input
                  type="text"
                  value={brokerAgency}
                  onChange={(e) => setBrokerAgency(e.target.value)}
                  className="w-full rounded-lg text-sm px-3 py-2 bg-[#0f172a] border border-[#334155] text-white"
                  placeholder="Apex Realty"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#10b981] text-[#0F172A] font-bold py-2.5 rounded-lg hover:bg-[#4edea3] transition-colors text-sm flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-[20px]">
                sync
              </span>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="text-center text-xs text-[#bbcabf]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#4edea3] hover:underline font-semibold"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
