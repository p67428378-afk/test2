import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PackagePlus,
  Search,
  Users,
  LogOut,
  Truck,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "customer";
  const email = localStorage.getItem("email") || "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    navigate("/login");
  };

  const menuItems = [
    {
      path: "/",
      name: "Dashboard",
      icon: LayoutDashboard,
      roles: ["customer", "admin"],
    },
    {
      path: "/book",
      name: "Book Shipment",
      icon: PackagePlus,
      roles: ["customer"],
    },
    {
      path: "/track",
      name: "Track Package",
      icon: Search,
      roles: ["customer", "admin"],
    },
    {
      path: "/agents",
      name: "Agents & Delivery",
      icon: Users,
      roles: ["admin"],
    },
  ];

  const filteredItems = menuItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <Truck className="h-8 w-8 text-indigo-400" />
        <div>
          <h1 className="font-bold text-lg leading-none">SwiftCourier</h1>
          <span className="text-xs text-slate-400">Delivery Portal</span>
        </div>
      </div>

      <div className="p-4 border-b border-slate-800 bg-slate-950/50">
        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
          Logged in as
        </p>
        <p className="text-sm font-medium truncate" title={email}>
          {email}
        </p>
        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
          {role}
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
