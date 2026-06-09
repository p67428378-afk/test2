import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AppLayout({ children }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'dashboard' },
    { path: '/reviews', label: 'Reviews', icon: 'fact_check' },
    { path: '/configuration', label: 'Configuration', icon: 'settings_input_component' },
  ];

  return (
    <div className="flex overflow-hidden min-h-screen bg-[#0F172A] text-[#d4e4fa]">
      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-low border-r border-outline-variant flex flex-col py-6 z-50">
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-surface font-bold text-lg">
            CS
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-lg font-bold text-primary">CodeShield</span>
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Enterprise Security</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 transition-colors duration-200 ease-in-out ${
                  isActive
                    ? 'text-primary bg-secondary-container/20 border-l-2 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {item.icon}
                </span>
                <span className="font-sans text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer User Tab */}
        <div className="mt-auto px-4">
          <div className="flex items-center gap-3 px-4 py-3 bg-surface-container-high rounded-lg">
            <div className="relative">
              <span className="material-symbols-outlined text-primary text-3xl">account_circle</span>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-surface-container-high rounded-full"></span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-sans text-xs font-semibold text-on-surface truncate">Sarah Chen</span>
              <span className="text-[10px] text-on-surface-variant truncate">Lead Developer</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-[260px] min-h-screen">
        {/* TopNavBar */}
        <header className="fixed top-0 right-0 h-[64px] w-[calc(100%-260px)] bg-surface border-b border-outline-variant flex justify-between items-center px-6 z-40">
          <div className="flex items-center flex-1 max-w-md">
            <div className="relative w-full group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none group-focus-within:text-primary transition-colors">
                search
              </span>
              <input
                className="w-full bg-surface-container-low border border-outline-variant rounded-full pl-10 pr-4 py-1.5 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                placeholder="Search pull requests..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-on-surface-variant hover:text-primary transition-all">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error text-[10px] text-on-error font-bold flex items-center justify-center rounded-full">
                3
              </span>
            </button>
            <button className="p-2 text-on-surface-variant hover:text-primary transition-all">
              <span className="material-symbols-outlined">help</span>
            </button>
            <div className="h-8 w-8 rounded-full border border-outline-variant overflow-hidden flex items-center justify-center bg-surface-container">
              <span className="material-symbols-outlined text-primary">account_circle</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mt-[64px] p-6 flex-1 overflow-y-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
