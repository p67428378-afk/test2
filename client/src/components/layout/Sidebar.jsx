import React from "react";

export default function Sidebar({ user, activeTab, setActiveTab, onLogout }) {
  if (!user) return null;

  const getNavItems = () => {
    switch (user.role) {
      case "customer":
        return [
          { id: "browse", label: "Browse Restaurants", icon: "restaurant" },
          { id: "orders", label: "My Orders", icon: "receipt_long" },
        ];
      case "restaurant":
        return [
          { id: "dashboard", label: "Dashboard", icon: "dashboard" },
          { id: "menu", label: "Manage Menu", icon: "menu_book" },
          { id: "profile", label: "Restaurant Profile", icon: "store" },
          { id: "analytics", label: "Analytics", icon: "analytics" },
        ];
      case "delivery":
        return [
          { id: "jobs", label: "Available Jobs", icon: "local_shipping" },
          { id: "my-deliveries", label: "My Deliveries", icon: "task_alt" },
        ];
      case "admin":
        return [
          { id: "metrics", label: "Platform Health", icon: "monitoring" },
          { id: "users", label: "Manage Users", icon: "group" },
          { id: "tickets", label: "Support Tickets", icon: "support_agent" },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-white border-r border-outline-variant min-h-screen flex flex-col justify-between shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <span className="material-symbols-outlined text-brand-coral text-3xl font-black">
            fastfood
          </span>
          <span className="font-headline-md text-headline-md font-black text-brand-coral">
            FoodDash
          </span>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-brand font-label-md text-label-md transition-all ${
                activeTab === item.id
                  ? "bg-primary-container text-on-primary-container font-bold"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-xl">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="p-6 border-t border-outline-variant">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-brand-coral/10 flex items-center justify-center text-brand-coral font-bold">
            {user.full_name ? user.full_name[0].toUpperCase() : "U"}
          </div>
          <div className="truncate">
            <p className="font-label-md text-label-md text-on-surface truncate">
              {user.full_name}
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant capitalize">
              {user.role}
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-outline text-on-surface-variant hover:text-brand-coral hover:border-brand-coral rounded-brand font-label-md text-label-md transition-all"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
