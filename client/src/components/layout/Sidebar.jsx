import React from "react";
import { Shield, LogOut, Key, RefreshCw, User } from "lucide-react";

export default function Sidebar({
  userEmail,
  onLogout,
  activeTab,
  setActiveTab,
}) {
  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-wide">
              FORTRESS
            </h1>
            <p className="text-xs text-slate-400">Secure Vault</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          <button
            onClick={() => setActiveTab("vault")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "vault"
                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
            }`}
          >
            <Key className="w-4 h-4" />
            My Vault
          </button>

          <button
            onClick={() => setActiveTab("generator")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "generator"
                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            Password Generator
          </button>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center gap-3 px-2 py-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-semibold text-sm border border-slate-700">
            {userEmail ? (
              userEmail[0].toUpperCase()
            ) : (
              <User className="w-4 h-4" />
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs text-slate-400 font-medium">Logged in as</p>
            <p
              className="text-sm text-slate-200 font-semibold truncate"
              title={userEmail}
            >
              {userEmail || "User"}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border border-transparent hover:border-rose-500/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
