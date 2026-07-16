import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      icon: "dashboard",
      path: user?.role === "broker" ? "/broker-dashboard" : "/buyer-portal",
      show: !!user,
    },
    {
      name: "Browse Listings",
      icon: "list_alt",
      path: "/buyer-portal",
      show: true,
    },
    {
      name: "Messages",
      icon: "mail",
      path: "/messages",
      show: !!user,
    },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-[280px] bg-[#131b2e] border-r border-[#3c4a42] flex flex-col py-6 z-50">
      <div className="px-4 mb-8 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-[#10b981] flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[#002113]">
            real_estate_agent
          </span>
        </div>
        <div>
          <h1 className="font-bold text-xl text-[#4edea3] truncate">
            BrokerHaven
          </h1>
          <p className="text-xs text-[#bbcabf] truncate">Command Center</p>
        </div>
      </div>

      {user?.role === "broker" && (
        <button
          onClick={() =>
            navigate("/broker-dashboard", { state: { openCreateModal: true } })
          }
          className="mx-4 mb-6 flex items-center justify-center gap-2 bg-[#10b981] text-[#0F172A] font-semibold py-2 rounded-lg hover:bg-[#4edea3] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          New Listing
        </button>
      )}

      <ul className="flex flex-col gap-1 px-4 flex-grow overflow-y-auto">
        {menuItems
          .filter((item) => item.show)
          .map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-left ${
                    isActive
                      ? "bg-[#10B981]/10 text-[#4edea3] font-bold border-l-4 border-[#4edea3]"
                      : "text-[#bbcabf] hover:bg-[#2d3449] hover:text-white"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined ${isActive ? "fill" : ""}`}
                  >
                    {item.icon}
                  </span>
                  {item.name}
                </button>
              </li>
            );
          })}
      </ul>

      <div className="mt-auto px-4 pt-4 border-t border-[#3c4a42] mx-4">
        {user ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 py-2">
              <div className="w-8 h-8 rounded-full bg-[#2d3449] flex items-center justify-center text-[#4edea3] font-bold">
                {user.full_name?.charAt(0).toUpperCase()}
              </div>
              <div className="truncate flex-1">
                <p className="text-sm font-medium text-white truncate">
                  {user.full_name}
                </p>
                <p className="text-xs text-[#bbcabf] truncate capitalize">
                  {user.role}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 text-xs text-[#ffb4ab] hover:text-red-400 py-1.5 border border-[#ffb4ab]/20 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">
                logout
              </span>
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-[#10b981]/10 text-[#4edea3] border border-[#10b981]/30 py-2 rounded-lg hover:bg-[#10b981]/20 transition-colors text-sm font-semibold"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="w-full bg-[#10b981] text-[#0F172A] py-2 rounded-lg hover:bg-[#4edea3] transition-colors text-sm font-semibold"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
