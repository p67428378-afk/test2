import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Users,
  DollarSign,
  ArrowRightLeft,
  Bell,
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { name: "Groups Overview", path: "/", icon: Users },
    { name: "Record Expense", path: "/expenses/new", icon: DollarSign },
    { name: "Settlements", path: "/settlements", icon: ArrowRightLeft },
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white border-b border-[#E3E8F0] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Nav links */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-white shadow-sm group-hover:bg-blue-700 transition-colors">
                <Sparkles className="w-5 h-5" />
              </span>
              <span className="font-bold text-lg text-blue-600 tracking-tight">
                BillSplitter
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-[#707A8C] hover:text-[#171C29] hover:bg-gray-50"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${active ? "text-blue-600" : "text-[#707A8C]"}`}
                    />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Icons & Avatar */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                AL
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-[#171C29]">Alice</p>
                <p className="text-[11px] text-[#707A8C]">alice@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
