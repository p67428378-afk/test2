import React from "react";

export default function Sidebar({ activeTab, onTabChange, brokerInfo }) {
  const menuItems = [
    { id: "listings", label: "My Listings", icon: "list_alt" },
    { id: "create", label: "Add Property", icon: "add_business" },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-outline-variant flex flex-col h-full">
      <div className="p-md border-b border-outline-variant bg-surface-container-low">
        <div className="flex items-center gap-sm">
          <div className="w-10 h-10 rounded-full bg-primary-fixed-dim text-on-primary-fixed flex items-center justify-center font-bold text-lg">
            {brokerInfo?.username
              ? brokerInfo.username.substring(0, 2).toUpperCase()
              : "BR"}
          </div>
          <div>
            <h4 className="font-headline-sm text-body-md font-bold text-on-surface truncate w-40">
              {brokerInfo?.username || "Broker Account"}
            </h4>
            <p className="text-label-sm text-outline truncate w-40">
              {brokerInfo?.email || "broker@homely.com"}
            </p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-md space-y-sm">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-md px-4 py-3 rounded-lg font-label-md text-label-md transition-all ${activeTab === item.id ? "bg-primary-container text-on-primary shadow-sm" : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"}`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-md border-t border-outline-variant text-center text-label-sm text-outline">
        Homely Broker Portal v1.0
      </div>
    </aside>
  );
}
