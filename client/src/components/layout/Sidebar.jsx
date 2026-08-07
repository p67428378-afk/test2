import React from "react";
import {
  LayoutDashboard,
  Laptop,
  ShoppingCart,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar({
  activeTab,
  setActiveTab,
  onLogout,
  isOpen,
  onClose,
}) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Laptop },
    { id: "orders", label: "Orders", icon: ShoppingCart },
  ];

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-outline-variant flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
          L
        </div>
        <div>
          <h1 className="font-headline-md text-title-lg text-on-primary-container font-bold tracking-tight">
            LaptopSeller
          </h1>
          <p className="text-label-md text-secondary-fixed-dim/70">
            Apex Laptops
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${
                    isActive
                      ? "border-l-4 border-primary bg-secondary-fixed-dim/10 text-primary-fixed font-bold"
                      : "text-secondary-fixed-dim hover:bg-secondary-fixed-dim/5 hover:text-on-primary-fixed-variant"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-outline-variant flex flex-col gap-2">
        <button
          onClick={() => {
            setActiveTab("settings");
            if (onClose) onClose();
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
            activeTab === "settings"
              ? "bg-secondary-fixed-dim/10 text-primary-fixed font-bold"
              : "text-secondary-fixed-dim hover:bg-secondary-fixed-dim/5 hover:text-on-primary-fixed-variant"
          }`}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg text-error hover:bg-error/10 transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-[260px] bg-inverse-surface text-primary-fixed border-r border-outline-variant shadow-sm flex flex-col z-50 hidden md:flex">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />
          <aside className="fixed left-0 top-0 h-full w-[260px] bg-inverse-surface text-primary-fixed border-r border-outline-variant shadow-sm flex flex-col z-50">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
