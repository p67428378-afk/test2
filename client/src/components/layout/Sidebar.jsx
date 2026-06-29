import React from "react";
import PropTypes from "prop-types";

export default function Sidebar({
  currentRole,
  activeTab,
  setActiveTab,
  onLogout,
}) {
  const menuItems = {
    customer: [
      { id: "browse", name: "Browse Restaurants", icon: "restaurant" },
      { id: "orders", name: "My Orders", icon: "receipt_long" },
      { id: "support", name: "Support Tickets", icon: "support_agent" },
    ],
    restaurant: [
      { id: "dashboard", name: "Dashboard", icon: "dashboard" },
      { id: "orders", name: "Order Queue", icon: "list_alt" },
      { id: "menu", name: "Manage Menu", icon: "menu_book" },
      { id: "profile", name: "Restaurant Profile", icon: "store" },
    ],
    delivery: [
      { id: "dashboard", name: "Driver Dashboard", icon: "sports_motorsports" },
      { id: "available", name: "Available Deliveries", icon: "local_shipping" },
      { id: "active", name: "Active Delivery", icon: "navigation" },
    ],
    admin: [
      {
        id: "dashboard",
        name: "Admin Dashboard",
        icon: "admin_panel_settings",
      },
      { id: "users", name: "Manage Users", icon: "group" },
      { id: "tickets", name: "Support Tickets", icon: "confirmation_number" },
    ],
  };

  const items = menuItems[currentRole] || [];

  return (
    <aside className="w-64 bg-white border-r border-outline-variant min-h-screen flex flex-col justify-between shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <span className="material-symbols-outlined text-brand-coral text-3xl font-bold">
            local_pizza
          </span>
          <span className="font-headline-md text-brand-coral font-black text-xl">
            FoodDash
          </span>
        </div>
        <nav className="space-y-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-brand font-label-md text-sm transition-colors ${
                activeTab === item.id
                  ? "bg-primary-container text-white font-bold"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {item.icon}
              </span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="p-6 border-t border-outline-variant">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-brand font-label-md text-sm text-error hover:bg-error-container hover:text-on-error-container transition-colors"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  currentRole: PropTypes.string.isRequired,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};
