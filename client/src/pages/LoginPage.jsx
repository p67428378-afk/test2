import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("testuser");
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        await authService.register(username, email, password);
        setIsRegister(false);
        setError("Registration successful! Please log in.");
      } else {
        await authService.login(username, password, rememberMe);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || "An error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-beekeeper-bg text-beekeeper-text-primary min-h-screen flex flex-col md:flex-row antialiased font-body-md overflow-hidden w-full">
      {/* Left Panel: Information & Branding */}
      <div className="w-full md:w-[55%] flex flex-col justify-between p-lg md:p-xl lg:p-[48px] relative bg-beekeeper-bg z-10">
        {/* Decorative Background Element */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, #F59E0B 0%, transparent 40%)",
            mixBlendMode: "screen",
          }}
        ></div>
        <div
          className="absolute bottom-0 right-0 opacity-5 pointer-events-none w-[300px] h-[300px]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 10px, #F59E0B 10px, #F59E0B 20px)",
          }}
        ></div>
        {/* Header Content */}
        <div className="mt-lg md:mt-xl z-20">
          <h1 className="font-display-lg text-display-lg text-beekeeper-amber mb-md tracking-tight">
            Beekeeper Pro
          </h1>
          <p className="font-body-lg text-body-lg text-beekeeper-text-secondary max-w-lg mb-xl leading-relaxed">
            Centralized IoT monitoring and operations dashboard for professional
            apiary managers.
          </p>
          {/* Feature List */}
          <ul className="space-y-md mt-xl">
            <li className="flex items-center gap-md group">
              <div className="w-10 h-10 rounded-lg bg-beekeeper-panel border border-beekeeper-border flex items-center justify-center shrink-0 group-hover:border-beekeeper-amber transition-colors">
                <span
                  className="material-symbols-outlined text-beekeeper-amber"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  sensors
                </span>
              </div>
              <span className="font-body-md text-body-md text-beekeeper-text-primary">
                Real-time Telemetry (temperature, humidity, weight)
              </span>
            </li>
            <li className="flex items-center gap-md group">
              <div className="w-10 h-10 rounded-lg bg-beekeeper-panel border border-beekeeper-border flex items-center justify-center shrink-0 group-hover:border-beekeeper-amber transition-colors">
                <span
                  className="material-symbols-outlined text-beekeeper-amber"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  trending_up
                </span>
              </div>
              <span className="font-body-md text-body-md text-beekeeper-text-primary">
                Production & Population Tracking
              </span>
            </li>
            <li className="flex items-center gap-md group">
              <div className="w-10 h-10 rounded-lg bg-beekeeper-panel border border-beekeeper-border flex items-center justify-center shrink-0 group-hover:border-beekeeper-amber transition-colors">
                <span
                  className="material-symbols-outlined text-beekeeper-amber"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  event_note
                </span>
              </div>
              <span className="font-body-md text-body-md text-beekeeper-text-primary">
                Inspection Scheduling & Disease Reporting
              </span>
            </li>
            <li className="flex items-center gap-md group">
              <div className="w-10 h-10 rounded-lg bg-beekeeper-panel border border-beekeeper-border flex items-center justify-center shrink-0 group-hover:border-beekeeper-amber transition-colors">
                <span
                  className="material-symbols-outlined text-beekeeper-amber"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  lock_clock
                </span>
              </div>
              <span className="font-body-md text-body-md text-beekeeper-text-primary">
                30-Day Extended Sessions (Remember Me)
              </span>
            </li>
          </ul>
        </div>
        {/* Footer */}
        <div className="mt-xl z-20">
          <p className="font-label-sm text-label-sm text-beekeeper-text-secondary opacity-60 uppercase tracking-widest">
            Powered by Apiary Insight. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full md:w-[45%] bg-beekeeper-panel min-h-screen flex items-center justify-center p-lg md:p-xl relative shadow-2xl z-20 border-l border-beekeeper-border">
        <div className="w-full max-w-md bg-beekeeper-bg rounded-lg border border-beekeeper-border p-xl shadow-lg relative overflow-hidden">
          {/* Subtle Top Accent Line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-beekeeper-amber"></div>
          <div className="mb-lg text-center">
            <h2 className="font-headline-lg text-headline-lg text-beekeeper-text-primary mb-sm">
              {isRegister ? "Register" : "Sign In"}
            </h2>
            <p className="font-body-md text-body-md text-beekeeper-text-secondary">
              {isRegister
                ? "Create your apiary account."
                : "Enter your credentials to manage your apiary."}
            </p>
          </div>

          {error && (
            <div
              className={`p-md mb-md rounded-lg text-body-md ${
                error.includes("successful")
                  ? "bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/20"
                  : "bg-error-container/10 text-error border border-error-container/20"
              }`}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-lg">
            {/* Username Input */}
            <div className="space-y-sm">
              <label
                className="font-label-md text-label-md text-beekeeper-text-primary block"
                htmlFor="username"
              >
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-md">
                  <span className="material-symbols-outlined text-beekeeper-text-secondary opacity-70">
                    person
                  </span>
                </span>
                <input
                  className="w-full bg-beekeeper-panel border border-beekeeper-border rounded-lg py-md pl-[44px] pr-md font-body-md text-body-md text-beekeeper-text-primary placeholder:text-beekeeper-text-secondary/50 focus:outline-none focus:border-beekeeper-amber focus:ring-1 focus:ring-beekeeper-amber transition-colors"
                  id="username"
                  name="username"
                  placeholder="testuser"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Input (Register only) */}
            {isRegister && (
              <div className="space-y-sm">
                <label
                  className="font-label-md text-label-md text-beekeeper-text-primary block"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-md">
                    <span className="material-symbols-outlined text-beekeeper-text-secondary opacity-70">
                      mail
                    </span>
                  </span>
                  <input
                    className="w-full bg-beekeeper-panel border border-beekeeper-border rounded-lg py-md pl-[44px] pr-md font-body-md text-body-md text-beekeeper-text-primary placeholder:text-beekeeper-text-secondary/50 focus:outline-none focus:border-beekeeper-amber focus:ring-1 focus:ring-beekeeper-amber transition-colors"
                    id="email"
                    name="email"
                    placeholder="test@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* Password Input */}
            <div className="space-y-sm">
              <label
                className="font-label-md text-label-md text-beekeeper-text-primary block"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-md">
                  <span className="material-symbols-outlined text-beekeeper-text-secondary opacity-70">
                    lock
                  </span>
                </span>
                <input
                  className="w-full bg-beekeeper-panel border border-beekeeper-border rounded-lg py-md pl-[44px] pr-md font-body-md text-body-md text-beekeeper-text-primary placeholder:text-beekeeper-text-secondary/50 focus:outline-none focus:border-beekeeper-amber focus:ring-1 focus:ring-beekeeper-amber transition-colors"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            {!isRegister && (
              <div className="flex items-center justify-between pt-sm">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    className="peer sr-only"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label
                    htmlFor="rememberMe"
                    className="flex items-center gap-sm cursor-pointer group"
                  >
                    <div className="w-5 h-5 rounded border border-beekeeper-border bg-beekeeper-panel peer-checked:bg-beekeeper-amber peer-checked:border-beekeeper-amber transition-colors flex items-center justify-center group-hover:border-beekeeper-amber/70">
                      <span
                        className="material-symbols-outlined text-[14px] text-beekeeper-bg opacity-0 peer-checked:opacity-100 transition-opacity"
                        style={{
                          fontVariationSettings: "'FILL' 1",
                          fontWeight: 700,
                        }}
                      >
                        check
                      </span>
                    </div>
                    <span className="font-label-sm text-label-sm text-beekeeper-text-secondary group-hover:text-beekeeper-text-primary transition-colors">
                      Remember me for 30 days
                    </span>
                  </label>
                </div>
                <a
                  className="font-label-sm text-label-sm text-beekeeper-amber hover:text-beekeeper-amber/80 hover:underline transition-all"
                  href="#"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot Password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              className="w-full bg-beekeeper-amber text-beekeeper-bg font-label-md text-label-md font-bold py-[14px] px-lg rounded-lg hover:bg-[#F59E0B]/90 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] flex justify-center items-center gap-sm mt-lg"
              type="submit"
              disabled={loading}
            >
              <span>
                {loading
                  ? "Processing..."
                  : isRegister
                    ? "Register"
                    : "Sign In"}
              </span>
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </button>

            <div className="text-center pt-sm">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                }}
                className="font-label-sm text-label-sm text-beekeeper-text-secondary hover:text-beekeeper-text-primary transition-colors"
              >
                {isRegister ? (
                  <span>
                    Already have an account?{" "}
                    <span className="text-beekeeper-amber underline">
                      Sign In
                    </span>
                  </span>
                ) : (
                  <span>
                    Don't have an account?{" "}
                    <span className="text-beekeeper-amber underline">
                      Register
                    </span>
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Test Credentials Box */}
          {!isRegister && (
            <div className="mt-xl pt-lg border-t border-beekeeper-border">
              <div className="bg-beekeeper-panel/50 border border-beekeeper-border border-dashed rounded-lg p-md flex items-start gap-md">
                <span
                  className="material-symbols-outlined text-beekeeper-text-secondary/70 mt-[2px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  info
                </span>
                <div>
                  <h4 className="font-label-sm text-label-sm text-beekeeper-text-secondary mb-xs uppercase tracking-wider">
                    Test Credentials
                  </h4>
                  <div className="font-body-md text-body-md text-beekeeper-text-primary space-y-[2px]">
                    <p>
                      Username:{" "}
                      <span className="font-mono text-beekeeper-amber text-[14px]">
                        testuser
                      </span>
                    </p>
                    <p>
                      Password:{" "}
                      <span className="font-mono text-beekeeper-amber text-[14px]">
                        testpassword
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
