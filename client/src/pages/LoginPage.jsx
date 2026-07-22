import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("testuser");
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
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
        await authService.login(username, password);
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
    <div className="min-h-screen flex items-center justify-center bg-background px-md">
      <div className="w-full max-w-md bg-surface-container p-lg rounded-xl border border-outline-variant flex flex-col gap-lg">
        <div className="text-center">
          <h1 className="font-headline-lg text-headline-lg text-primary mb-xs">
            Beekeeper Pro
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {isRegister
              ? "Create your apiary account"
              : "Sign in to manage your apiary"}
          </p>
        </div>

        {error && (
          <div
            className={`p-md rounded-lg text-body-md ${error.includes("successful") ? "bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/20" : "bg-error/10 text-error border border-error/20"}`}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <InputField
            label="Username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {isRegister && (
            <InputField
              label="Email Address"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}

          <InputField
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" disabled={loading} className="w-full mt-md">
            {loading ? "Processing..." : isRegister ? "Register" : "Sign In"}
          </Button>
        </form>

        <div className="text-center flex flex-col gap-sm">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="text-primary hover:underline font-label-md text-label-md"
          >
            {isRegister
              ? "Already have an account? Sign In"
              : "Don't have an account? Register"}
          </button>

          {!isRegister && (
            <div className="mt-md p-md bg-surface-container-low rounded-lg border border-outline-variant text-left">
              <span className="font-label-md text-label-md text-primary block mb-1">
                Test Credentials:
              </span>
              <span className="font-mono-data text-mono-data text-on-surface-variant block">
                Username: testuser
              </span>
              <span className="font-mono-data text-mono-data text-on-surface-variant block">
                Password: testpassword
              </span>
              <span className="text-[12px] text-on-surface-variant block mt-2">
                Note: You can also register a new account.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
