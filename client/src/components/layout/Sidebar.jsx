import React from "react";
import {
  ShieldAlert,
  KeyRound,
  ShieldCheck,
  Settings,
  User,
  LogOut,
} from "lucide-react";

export default function Sidebar({
  activeTab,
  setActiveTab,
  onLogout,
  userEmail,
}) {
  const navItems = [
    { id: "vault", label: "Vault", icon: KeyRound },
    { id: "generator", label: "Password Generator", icon: ShieldAlert },
    { id: "audit", label: "Security Audit", icon: ShieldCheck },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="fixed left-0 top-0 h-screen w-[260px] bg-surface-container-lowest border-r border-outline-variant/10 flex flex-col py-lg z-20">
      {/* Brand Header */}
      <div className="px-md mb-xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-[#0F172A] font-bold text-xl cyber-glow-primary">
          VC
        </div>
        <div>
          <h1 className="font-headline-sm text-headline-sm font-bold text-primary tracking-tight">
            VaultCipher
          </h1>
          <p className="font-label-md text-label-md text-on-surface-variant">
            Digital Fortress
          </p>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-sm space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all active:scale-95 ${
                isActive
                  ? "text-primary font-bold border-r-2 border-primary bg-surface-variant/10"
                  : "text-on-surface-variant hover:bg-surface-variant/30 hover:text-on-surface"
              }`}
            >
              <Icon className="w-[20px] h-[20px]" />
              <span className="font-body-md text-body-md">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer Navigation & CTA */}
      <div className="px-md mt-auto pt-4 border-t border-outline-variant/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-4 rounded-lg text-on-surface-variant">
          <User className="w-[20px] h-[20px]" />
          <span
            className="font-body-md text-body-md truncate max-w-[160px]"
            title={userEmail}
          >
            {userEmail || "Profile"}
          </span>
        </div>
        <button
          onClick={onLogout}
          className="w-full py-2 px-4 bg-primary-container text-[#0F172A] rounded-lg font-label-md text-label-md font-bold hover:shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Lock Vault
        </button>
      </div>
    </nav>
  );
}
