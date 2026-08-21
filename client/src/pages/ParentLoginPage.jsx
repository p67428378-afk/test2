import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import KidHeader from "../components/KidHeader";
import { authService } from "../services/api";

export default function ParentLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.login(username, password);
      navigate("/parent");
    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err.response?.data?.detail ||
          "Invalid username or password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f2faff] flex flex-col gap-[24px] items-start p-[32px] relative min-h-screen w-full">
      <KidHeader activeTab="parents" />

      <div
        className="flex flex-col items-center overflow-clip p-[32px] relative shrink-0 w-full"
        data-node-id="2:105"
        data-name="CenterContainer"
      >
        <div
          className="bg-white border border-[#cce0f2] border-solid flex flex-col gap-[16px] items-start overflow-clip p-[24px] relative rounded-[14px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] shrink-0 w-full max-w-[450px]"
          data-node-id="2:103"
          data-name="LoginForm"
        >
          <p
            className="font-bold leading-[normal] not-italic relative shrink-0 text-[#1a2640] text-[18px] whitespace-nowrap"
            data-node-id="2:104"
          >
            Parent Area Login
          </p>
          <p
            className="font-normal leading-[normal] not-italic relative shrink-0 text-[#668099] text-[14px]"
            data-node-id="2:89"
          >
            Please enter your parent credentials to access the progress
            dashboard.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg w-full text-sm">
              {error}
            </div>
          )}

          <form
            onSubmit={handleLogin}
            className="w-full flex flex-col gap-[16px]"
          >
            <div
              className="flex flex-col gap-[4px] items-start overflow-clip relative shrink-0 w-full"
              data-node-id="2:90"
              data-name="Field"
            >
              <label
                className="font-medium leading-[normal] not-italic relative shrink-0 text-[#668099] text-[12px] whitespace-nowrap"
                htmlFor="username"
              >
                Username / Email
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-[#ebf5fa] border border-[#cce0f2] border-solid flex items-start overflow-clip p-[12px] relative rounded-[10px] shrink-0 w-full text-[#1a2640] focus:outline-none focus:ring-2 focus:ring-[#ff6e00]"
                required
              />
            </div>

            <div
              className="flex flex-col gap-[4px] items-start overflow-clip relative shrink-0 w-full"
              data-node-id="2:94"
              data-name="Field"
            >
              <label
                className="font-medium leading-[normal] not-italic relative shrink-0 text-[#668099] text-[12px] whitespace-nowrap"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#ebf5fa] border border-[#cce0f2] border-solid flex items-start overflow-clip p-[12px] relative rounded-[10px] shrink-0 w-full text-[#1a2640] focus:outline-none focus:ring-2 focus:ring-[#ff6e00]"
                required
              />
            </div>

            <div className="bg-orange-50 border border-orange-200 text-orange-800 p-3 rounded-lg w-full text-xs">
              <p className="font-bold mb-1">💡 Test Credentials:</p>
              <p>
                Username:{" "}
                <code className="font-mono bg-white px-1 py-0.5 rounded">
                  test@example.com
                </code>
              </p>
              <p>
                Password:{" "}
                <code className="font-mono bg-white px-1 py-0.5 rounded">
                  testpassword
                </code>
              </p>
            </div>

            <div
              className="flex items-center justify-between overflow-clip relative shrink-0 w-full pt-2"
              data-node-id="2:102"
              data-name="Actions"
            >
              <button
                type="button"
                onClick={() => navigate("/")}
                className="bg-white border border-[#cce0f2] border-solid hover:bg-[#f2faff] active:scale-95 transition-all flex items-center justify-center overflow-clip px-[16px] py-[12px] relative rounded-[10px] shrink-0 text-[#1a2640] font-medium text-[14px]"
                data-node-id="2:98"
                data-name="Button"
              >
                Back to Learning
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#ff6e00] hover:bg-[#e05c00] disabled:bg-gray-400 active:scale-95 transition-all flex items-center justify-center overflow-clip px-[16px] py-[12px] relative rounded-[10px] shrink-0 text-white font-medium text-[14px]"
                data-node-id="2:100"
                data-name="Button"
              >
                {loading ? "Logging in..." : "Login to Dashboard"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
