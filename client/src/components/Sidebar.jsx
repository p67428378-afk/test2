import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/api";
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  User,
  LogOut,
  Truck,
  Users,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  if (!user) return null;

  const links = [
    {
      name: "Dashboard",
      path: `/${user.role}`,
      icon: LayoutDashboard,
      roles: ["restaurant", "ngo", "volunteer", "admin"],
    },
    {
      name: "Create Donation",
      path: "/restaurant/create",
      icon: PlusCircle,
      roles: ["restaurant"],
    },
    {
      name: "My Donations",
      path: "/restaurant/my-donations",
      icon: ClipboardList,
      roles: ["restaurant"],
    },
    {
      name: "Browse Donations",
      path: "/ngo/browse",
      icon: ClipboardList,
      roles: ["ngo"],
    },
    {
      name: "Deliveries",
      path: "/volunteer/deliveries",
      icon: Truck,
      roles: ["volunteer"],
    },
    {
      name: "Manage Users",
      path: "/admin/users",
      icon: Users,
      roles: ["admin"],
    },
  ];

  return (
    <nav className="fixed left-0 top-0 h-screen w-[280px] bg-[#0F172A] shadow-sm flex flex-col py-6 z-20">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">
          S
        </div>
        <div>
          <h1 className="text-xl font-bold text-emerald-400">ShareBite</h1>
          <p className="text-xs text-slate-400">Food Logistics</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {links
            .filter((link) => link.roles.includes(user.role))
            .map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className={`w-full flex items-center gap-3 px-6 py-3 text-left font-medium text-sm transition-colors ${
                      isActive
                        ? "text-white border-l-4 border-emerald-500 bg-white/5"
                        : "text-slate-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.name}
                  </button>
                </li>
              );
            })}
        </ul>
      </div>

      <div className="mt-auto px-4 space-y-2">
        <div className="flex items-center gap-3 px-4 py-3 text-slate-300 bg-white/5 rounded-lg">
          <User className="w-5 h-5 text-emerald-400" />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{user.full_name}</p>
            <p className="text-xs text-slate-400 capitalize">{user.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors rounded-lg text-sm font-medium"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </nav>
  );
}
