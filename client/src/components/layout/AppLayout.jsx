import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  PlusCircle,
  LayoutDashboard,
  ShieldAlert,
  LogOut,
  Bell,
  User,
  Menu,
  X,
} from "lucide-react";

export default function AppLayout({ children, onSearch }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const menuItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/report", label: "Report an Item", icon: PlusCircle },
    { path: "/admin", label: "Admin Portal", icon: ShieldAlert },
  ];

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setQueryState(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const setQueryState = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar - Desktop */}
      <aside className="fixed h-full w-[280px] left-0 top-0 bg-slate-900 text-white shadow-md hidden md:flex flex-col py-6 z-50">
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Search className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">ReFind AI</h1>
            <p className="text-xs text-slate-400">Lost & Found System</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800 px-4">
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <aside
            className="w-[280px] h-full bg-slate-900 text-white flex flex-col py-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <Search className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">ReFind AI</h1>
                  <p className="text-xs text-slate-400">Lost & Found System</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex-1 flex flex-col gap-1 px-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-800 px-4">
              <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-[280px]">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-full md:hidden transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden md:flex items-center max-w-md w-80">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search items..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-sm">
                JD
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:inline">
                John Doe
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 flex-1">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
