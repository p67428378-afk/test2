import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../services/api";

const AppLayout = ({ children, onLock, countdown }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/", label: "All Items", icon: "shield" },
    { path: "/generator", label: "Password Generator", icon: "password" },
    { path: "/import-export", label: "Import/Export", icon: "input" },
  ];

  return (
    <div className="bg-[#0b1326] text-[#dae2fd] font-body-md h-screen flex overflow-hidden selection:bg-[#4edea3]/30 selection:text-[#4edea3]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-[260px] bg-[#171f33] border-r border-[#3c4a42] flex flex-col py-6 px-4 z-20">
        <div className="flex items-center gap-1 mb-8 px-1">
          <div className="w-8 h-8 bg-[#4edea3] rounded flex items-center justify-center text-[#003824] font-bold">
            <span
              className="material-symbols-outlined text-lg"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              security
            </span>
          </div>
          <div>
            <h1 className="font-headline-lg-mobile text-lg font-bold text-[#4edea3] leading-none">
              ShieldVault
            </h1>
            <p className="text-[10px] text-[#bbcabf] uppercase tracking-wider">
              Secure Enterprise Vault
            </p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-4 px-4 py-2.5 rounded-lg cursor-pointer active:scale-95 transition-all text-left w-full ${
                  isActive
                    ? "bg-[#0566d9] text-white font-semibold"
                    : "text-[#bbcabf] hover:text-[#dae2fd] hover:bg-[#222a3d]"
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {item.icon}
                </span>
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-4 border-t border-[#3c4a42] pt-4">
          <button
            onClick={onLock}
            className="w-full bg-[#4edea3] text-[#003824] font-semibold py-2 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">lock</span>
            Lock Vault
          </button>

          <div
            className="flex items-center justify-between gap-2 px-1 text-[#bbcabf] hover:text-[#dae2fd] cursor-pointer rounded-lg hover:bg-[#222a3d] p-2 transition-colors"
            onClick={handleLogout}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#2d3449] flex items-center justify-center border border-[#3c4a42] shrink-0">
                <span className="material-symbols-outlined text-sm">
                  person
                </span>
              </div>
              <span className="text-xs truncate max-w-[120px]">
                {user?.email || "User"}
              </span>
            </div>
            <span className="material-symbols-outlined text-sm hover:text-[#ffb4ab]">
              logout
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-[260px]">
        {/* Header */}
        <header className="fixed top-0 right-0 h-16 w-[calc(100%-260px)] bg-[#0b1326] border-b border-[#3c4a42] flex justify-between items-center px-6 z-10">
          <div className="flex items-center w-96 relative group">
            <h2 className="text-lg font-semibold text-[#4edea3]">
              ShieldVault Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[#bbcabf] border border-[#3c4a42] rounded-lg px-3 py-1.5 bg-[#060e20]">
              <span className="material-symbols-outlined text-sm">timer</span>
              <span className="font-mono text-sm font-bold">{countdown}</span>
            </div>

            <div className="flex items-center gap-4 border-l border-[#3c4a42] pl-4">
              <div className="w-8 h-8 rounded-full bg-[#2d3449] border border-[#3c4a42] overflow-hidden flex items-center justify-center">
                <span className="material-symbols-outlined text-lg text-[#4edea3]">
                  shield_person
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto mt-16 p-6 bg-[#0b1326]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
