import React from 'react';
import { authService } from '../../services/api';

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen, user }) {
  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'transfer', label: 'Payments', icon: 'swap_horiz' },
    { id: 'statements', label: 'Statements', icon: 'account_balance_wallet' },
  ];

  return (
    <>
      {/* Sidebar container */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-surface-container-low border-r border-outline-variant z-50 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col p-md gap-sm`}
        id="sidebar"
      >
        <div className="mb-xl px-sm flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary text-3xl">account_balance</span>
            <span className="font-headline-md text-headline-md font-bold text-primary">Apex Bank</span>
          </div>
          <button
            className="md:hidden text-on-surface-variant hover:bg-surface-container-high p-1 rounded-full"
            onClick={() => setIsOpen(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex flex-col gap-xs flex-grow">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={`w-full rounded-lg font-bold flex items-center gap-md p-md cursor-pointer transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-label-lg text-label-lg">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="mt-auto border-t border-outline-variant pt-md px-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-md overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold flex-shrink-0">
                {user?.login_id ? user.login_id.substring(0, 2).toUpperCase() : 'JD'}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-label-lg text-label-lg text-on-surface truncate">
                  {user?.login_id || 'John Doe'}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  ID: {user?.id ? user.id.substring(0, 8) : '98432'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-on-surface-variant hover:text-error p-2 rounded-full hover:bg-surface-container-high transition-colors"
              title="Logout"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
