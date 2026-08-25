import React, { useState } from "react";
import { Shield, Lock, User, AlertCircle, RefreshCw } from "lucide-react";

export default function AdminLoginForm({ onLogin, isLoading, error }) {
  const [username, setUsername] = useState("admin@example.com");
  const [password, setPassword] = useState("adminpassword");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) return;
    onLogin(username, password);
  };

  return (
    <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm max-w-md mx-auto">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 text-blue-700">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          Sign In to Admin Portal
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Authorized City Parking Enforcement Administration
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-medium flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Username / Admin Email
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin@example.com"
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm text-sm flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-slate-200 text-center bg-slate-50 p-3 rounded-lg border">
        <p className="text-xs font-medium text-slate-600">
          🔑 Test Admin Credentials:
        </p>
        <p className="text-xs font-mono text-slate-800 mt-1">
          admin@example.com / adminpassword
        </p>
      </div>
    </div>
  );
}
