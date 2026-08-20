import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import Field from "../components/common/Field";
import Button from "../components/common/Button";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authService.login(username, password);
      if (data.user.role === "parent") {
        navigate("/parent");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          "Invalid username or password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (userType) => {
    setError("");
    setLoading(true);
    const credentials =
      userType === "kid"
        ? { u: "test@example.com", p: "testpassword" }
        : { u: "admin@example.com", p: "adminpassword" };

    setUsername(credentials.u);
    setPassword(credentials.p);

    try {
      const data = await authService.login(credentials.u, credentials.p);
      if (data.user.role === "parent") {
        navigate("/parent");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Quick login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#edf2fa] flex flex-col items-center justify-center p-8">
      <div className="bg-white border border-[#e0e5f0] flex flex-col gap-6 items-center p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="text-center flex flex-col gap-1">
          <h1 className="font-bold text-[#4f45e5] text-3xl">
            🌟 Healthy Habits Hero
          </h1>
          <p className="text-[#63738c] text-sm">
            Log in to start your healthy journey!
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-error text-error text-sm p-3 rounded-xl w-full text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
          <Field
            label="Username or Email"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username or email"
            required
          />
          <Field
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />

          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? "Logging in..." : "Log In 🚀"}
          </Button>
        </form>

        <div className="w-full border-t border-[#e0e5f0] my-2"></div>

        <div className="flex flex-col gap-3 w-full">
          <p className="text-xs text-[#63738c] text-center font-medium">
            Quick Demo Logins:
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => handleQuickLogin("kid")}
              className="flex-1 bg-[#edf2fa] hover:bg-[#e0e5f0] text-[#1f293b] py-2.5 px-4 rounded-xl text-xs font-bold transition-colors flex flex-col items-center gap-1"
            >
              <span>🧒 Kid Login</span>
              <span className="text-[10px] font-normal text-[#63738c]">
                test@example.com
              </span>
            </button>
            <button
              onClick={() => handleQuickLogin("parent")}
              className="flex-1 bg-[#edf2fa] hover:bg-[#e0e5f0] text-[#1f293b] py-2.5 px-4 rounded-xl text-xs font-bold transition-colors flex flex-col items-center gap-1"
            >
              <span>🔑 Parent Login</span>
              <span className="text-[10px] font-normal text-[#63738c]">
                admin@example.com
              </span>
            </button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700 w-full text-center">
          <p className="font-semibold">Test Accounts:</p>
          <p>Kid: test@example.com / testpassword</p>
          <p>Parent: admin@example.com / adminpassword</p>
        </div>
      </div>
    </div>
  );
}
