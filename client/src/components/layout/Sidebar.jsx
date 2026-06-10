import React from 'react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'tracking', label: 'Body Tracking', icon: 'inventory_2' },
    { id: 'arrangements', label: 'Funeral Arrangements', icon: 'event_available' },
    { id: 'billing', label: 'Billing & Invoicing', icon: 'receipt_long' },
  ];

  return (
    <aside className="w-[260px] h-screen fixed left-0 top-0 overflow-y-auto bg-surface-container border-r border-outline-variant flex flex-col p-spacing-base z-50">
      <div className="mb-8 px-4 py-2">
        <h1 className="text-headline-lg font-headline-lg text-primary-fixed tracking-tight">EternalRest</h1>
        <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-widest mt-1">Mortuary Management</p>
      </div>
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left w-full ${
              activeTab === item.id
                ? 'bg-secondary-container text-on-secondary-container font-bold'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-label-md text-label-md">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto border-t border-outline-variant pt-4 flex flex-col gap-1">
        <button className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-all text-left w-full">
          <span className="material-symbols-outlined">help</span>
          <span className="font-label-md text-label-md">Support</span>
        </button>
        <button className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-all text-left w-full">
          <span className="material-symbols-outlined">logout</span>
          <span className="font-label-md text-label-md">Logout</span>
        </button>
        <div className="mt-4 px-4 py-3 bg-surface-container-low rounded-lg flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-xs">
            AP
          </div>
          <div className="flex flex-col">
            <span className="text-label-md font-bold truncate">Arthur Pendelton</span>
            <span className="text-[10px] text-on-surface-variant">Director</span>
          </div>
        </div>
      </div>
    </aside>
  );
}