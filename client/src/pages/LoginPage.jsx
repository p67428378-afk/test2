import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import { Briefcase, Lock, Mail, UserPlus, LogIn } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [role, setRole] = useState("job_seeker");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await authService.login(email, password);
      setSuccess("Logged in successfully!");
      const user = await authService.getMe();
      if (user.role === "employer") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await authService.register(email, password, role);
      setSuccess("Registration successful! Please log in.");
      setIsRegister(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    }
  };

  const selectTestAccount = (type) => {
    if (type === "seeker") {
      setEmail("test@example.com");
      setPassword("testpassword");
      setRole("job_seeker");
    } else {
      setEmail("admin@example.com");
      setPassword("adminpassword");
      setRole("employer");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-[14px] border border-[#e3e8f0] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)]">
        <div>
          <div className="flex justify-center">
            <Briefcase className="h-12 w-12 text-[#2663eb]" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#171c29]">
            {isRegister ? "Create your account" : "Sign in to your account"}
          </h2>
          <p className="mt-2 text-center text-sm text-[#707a8c]">
            Or{" "}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
                setSuccess("");
              }}
              className="font-medium text-[#2663eb] hover:text-blue-500 focus:outline-none"
            >
              {isRegister
                ? "already have an account? Sign in"
                : "need an account? Register"}
            </button>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-[#db2626] p-4 rounded-md">
            <p className="text-sm text-[#db2626]">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-[#17a34a] p-4 rounded-md">
            <p className="text-sm text-[#17a34a]">{success}</p>
          </div>
        )}

        <form
          className="mt-8 space-y-6"
          onSubmit={isRegister ? handleRegister : handleLogin}
        >
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#707a8c] mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#707a8c]" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-[10px] relative block w-full px-3 py-2 pl-10 border border-[#e3e8f0] placeholder-[#707a8c] text-[#171c29] bg-[#f2f5fa] focus:outline-none focus:ring-[#2663eb] focus:border-[#2663eb] sm:text-sm"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#707a8c] mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#707a8c]" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-[10px] relative block w-full px-3 py-2 pl-10 border border-[#e3e8f0] placeholder-[#707a8c] text-[#171c29] bg-[#f2f5fa] focus:outline-none focus:ring-[#2663eb] focus:border-[#2663eb] sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-[#707a8c] mb-1">
                  I want to join as
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="block w-full px-3 py-2 border border-[#e3e8f0] bg-[#f2f5fa] rounded-[10px] text-[#171c29] focus:outline-none focus:ring-[#2663eb] focus:border-[#2663eb] sm:text-sm"
                >
                  <option value="job_seeker">
                    Job Seeker (Apply for jobs)
                  </option>
                  <option value="employer">
                    Employer (Post jobs & manage applications)
                  </option>
                </select>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-[10px] text-white bg-[#2663eb] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2663eb] transition-colors"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isRegister ? (
                  <UserPlus className="h-5 w-5 text-blue-300" />
                ) : (
                  <LogIn className="h-5 w-5 text-blue-300" />
                )}
              </span>
              {isRegister ? "Register" : "Sign In"}
            </button>
          </div>
        </form>

        <div className="mt-6 border-t border-[#e3e8f0] pt-6">
          <p className="text-xs font-semibold text-[#707a8c] uppercase tracking-wider text-center mb-3">
            Quick Test Accounts
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => selectTestAccount("seeker")}
              className="flex flex-col items-center justify-center p-3 border border-[#e3e8f0] rounded-[10px] hover:bg-[#f2f5fa] transition-colors text-left"
            >
              <span className="text-xs font-bold text-[#171c29]">
                Job Seeker
              </span>
              <span className="text-[10px] text-[#707a8c]">
                test@example.com
              </span>
              <span className="text-[10px] text-[#707a8c]">testpassword</span>
            </button>
            <button
              onClick={() => selectTestAccount("employer")}
              className="flex flex-col items-center justify-center p-3 border border-[#e3e8f0] rounded-[10px] hover:bg-[#f2f5fa] transition-colors text-left"
            >
              <span className="text-xs font-bold text-[#171c29]">Employer</span>
              <span className="text-[10px] text-[#707a8c]">
                admin@example.com
              </span>
              <span className="text-[10px] text-[#707a8c]">adminpassword</span>
            </button>
          </div>
          <p className="text-[11px] text-[#707a8c] text-center mt-3">
            * Test account: test@example.com / testpassword
          </p>
        </div>
      </div>
    </div>
  );
}
