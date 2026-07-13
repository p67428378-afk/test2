import React from "react";
import {
  Shield,
  Lock,
  Star,
  KeyRound,
  ShieldAlert,
  Settings,
  User,
  LogOut,
  Plus,
} from "lucide-react";

export default function Sidebar({
  activeTab,
  setActiveTab,
  onLogout,
  user,
  onOpenAddModal,
}) {
  const menuItems = [
    { id: "all", label: "All Items", icon: Lock },
    { id: "favorites", label: "Favorites", icon: Star },
    { id: "generator", label: "Password Generator", icon: KeyRound },
    { id: "audit", label: "Security Audit", icon: ShieldAlert },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="bg-[#131b2e] text-[#4edea3] fixed left-0 top-0 h-screen w-[280px] border-r border-[#3c4a42] hidden md:flex flex-col py-6 px-4 z-50">
      {/* Brand/Logo */}
      <div className="flex items-center gap-2 mb-12">
        <Shield className="w-8 h-8 text-[#4edea3]" />
        <div>
          <h1 className="text-2xl font-bold text-[#4edea3]">LockBox</h1>
          <p className="text-xs text-[#bbcabf]">Enterprise Vault</p>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onOpenAddModal}
        className="bg-[#10b981] text-[#002113] font-semibold py-2 px-4 rounded-lg mb-6 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
      >
        <Plus className="w-5 h-5" />
        Add New Secret
      </button>

      {/* Navigation Links */}
      <ul className="flex flex-col gap-1 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-4 py-2 px-4 rounded-lg w-full text-left transition-all ${
                  isActive
                    ? "text-[#4edea3] font-bold border-r-2 border-[#4edea3] bg-[#222a3d] opacity-100 scale-100"
                    : "text-[#bbcabf] hover:bg-[#2d3449] hover:text-[#dae2fd]"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>

      {/* User Card Bottom */}
      <div className="mt-auto border-t border-[#3c4a42] pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-[#4edea3] text-[#003824] flex items-center justify-center font-bold shrink-0">
            {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-[#dae2fd] truncate">
              {user?.username || "Alex Rivera"}
            </p>
            <p className="text-[10px] text-[#bbcabf] truncate">
              {user?.username || "alex.rivera@secure.io"}
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="text-[#bbcabf] hover:text-[#ffb4ab] transition-colors shrink-0"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}
