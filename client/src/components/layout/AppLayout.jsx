import React from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/api";

export default function AppLayout({ children }) {
  const navigate = useNavigate();
  const userEmail = authService.getUserEmail();
  const userName = userEmail.split("@")[0];

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <div className="bg-background text-on-surface min-h-screen font-body-sm text-body-sm antialiased">
      {/* SideNavBar Component */}
      <nav className="bg-surface-container fixed left-0 top-0 h-screen w-[260px] border-r border-outline-variant flex flex-col justify-between py-container-padding z-50">
        <div>
          <div className="px-container-padding mb-8">
            <div className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  account_balance_wallet
                </span>
              </div>
              <div>
                FinTrack
                <div className="font-label-md text-label-md text-on-surface-variant font-normal">
                  Wallet Manager
                </div>
              </div>
            </div>
          </div>
          <ul className="space-y-2 px-4">
            <li>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-primary font-bold border-r-4 border-primary bg-primary-container/10 transition-transform duration-150 font-body-lg text-body-lg text-left">
                <span className="material-symbols-outlined">dashboard</span>
                Dashboard
              </button>
            </li>
          </ul>
        </div>
        <div className="px-4 flex flex-col gap-2">
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg text-on-surface-variant font-body-lg text-body-lg">
            <span className="material-symbols-outlined">person</span>
            <span className="truncate" title={userEmail}>
              {userName}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-error hover:bg-error-container/20 transition-colors font-body-lg text-body-lg text-left w-full"
          >
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>
      </nav>

      {/* TopNavBar Component */}
      <header className="bg-surface fixed top-0 right-0 h-16 w-[calc(100%-260px)] z-40 border-b border-outline-variant flex justify-between items-center px-container-padding">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input
              className="w-full bg-background border border-outline-variant rounded-full py-2 pl-10 pr-4 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow font-body-sm text-body-sm placeholder-on-surface-variant"
              placeholder="Search..."
              type="text"
              disabled
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-on-surface-variant hover:bg-surface-container-high rounded-full p-2 transition-all">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-cover border border-outline-variant cursor-pointer bg-primary-container flex items-center justify-center text-on-primary-container font-bold">
            {userName.substring(0, 2).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="ml-[260px] pt-16 min-h-screen">
        <div className="p-container-padding max-w-[1440px] mx-auto space-y-card-gap">
          {children}
        </div>
      </main>
    </div>
  );
}
