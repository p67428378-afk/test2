import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { authService } from "../../services/api";

export default function Sidebar() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser() || {
    username: "Marcus Vance",
    email: "test@example.com",
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/", label: "Dashboard", icon: "dashboard" },
    {
      to: "/inspections",
      label: "Inspections & Diseases",
      icon: "health_and_safety",
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-surface-container border-r border-outline-variant flex flex-col justify-between py-lg z-50">
      <div className="px-md">
        <div className="flex items-center gap-sm mb-xl">
          <img
            alt="Apiary Brand Logo"
            className="w-8 h-8 rounded-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCds5yxtxDdaSdYkvDpUk7N_pSOsWcKeS-nUxtXYKtfC1hDBoeUs2Ga7dgvJbbzWqv7ojOTO8dQBAsd2x48z4hEXYJdul09gBO40xudh81QwrBbhbdWyGt8CJ1zRgU51xBoP1w38ABzSHhKf9rjgXZwSYt0svtRnIjBuf5TzS2DxKxVXO7H7PG4owFgpmn0UModuhuSf7NAlRjgFIFfTqePQX1A6k8toiT-p6WSsps5k_Wh4xop4Um3tNQnlu0Ldzm7EBuc5_am8Uk"
          />
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary">
              Beekeeper Pro
            </h1>
            <span className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider mt-xs">
              Apiary Manager
            </span>
          </div>
        </div>
        <nav className="flex flex-col gap-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-md px-md py-sm rounded-r-full cursor-pointer transition-all ${
                  isActive
                    ? "text-on-primary-container border-l-[3px] border-primary bg-surface-container-high"
                    : "text-on-surface-variant hover:text-primary hover:bg-surface-container-highest"
                }`
              }
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {item.icon}
              </span>
              <span className="font-label-md text-label-md">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="px-md flex flex-col gap-sm">
        <div className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant">
          <img
            alt={currentUser.username}
            className="w-8 h-8 rounded-full border border-outline-variant"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCINlUdXpicaEYFqSlzFbBsRdvK3e1eHNdMqm977ql866voSApCnQ8A3tE2fCm2EG65Gw16vxdvevC_gnwB6wV5_RHThp8hjCHPgBw5yucIU1Vpk3wWTXGEILDL-EjK3igM4UmYTszDehKugKePLrnzpwfY5KawILzSGWLw4Ae52g2w36zPR08-KwlQuZldkOUjtRteofEMgVB12jn6x3R8fUiEInuL7ZiVYUo_cTSCxHj8EZNM8KlD4kFze0RmtISVGUb8K4XVBlU"
          />
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-on-surface">
              {currentUser.username}
            </span>
            <span className="text-[10px] text-on-surface-variant">
              {currentUser.email}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-md px-md py-sm rounded-lg text-error hover:bg-error/10 transition-colors w-full text-left"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-label-md text-label-md">Logout</span>
        </button>
      </div>
    </aside>
  );
}
