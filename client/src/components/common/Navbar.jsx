import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Camera,
  Calendar,
  DollarSign,
  CheckCircle2,
  User,
  LogOut,
} from "lucide-react";

export default function Navbar({ currentUser, onLogout, onLoginClick }) {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Book Session", icon: Camera },
    { path: "/availability", label: "Photographer Schedule", icon: Calendar },
    { path: "/sessions", label: "Session Tracker", icon: CheckCircle2 },
    { path: "/admin", label: "Packages & Ledger", icon: DollarSign },
  ];

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#C5A059] flex items-center justify-center text-white font-serif font-bold text-xl shadow-inner">
                A
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#2C2C2C]">
                Aura <span className="text-[#C5A059] font-normal">Studio</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1 sm:space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-amber-50 text-[#775A19] font-semibold border-b-2 border-[#C5A059]"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Role / Auth Section */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="text-right text-xs hidden sm:block">
                  <p className="font-semibold text-stone-800">
                    {currentUser.full_name || currentUser.email}
                  </p>
                  <p className="text-amber-800 capitalize font-medium">
                    {currentUser.role || "User"}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 font-bold text-xs">
                  {currentUser.full_name
                    ? currentUser.full_name.charAt(0).toUpperCase()
                    : "U"}
                </div>
                <button
                  onClick={onLogout}
                  title="Log out"
                  className="p-1.5 text-stone-500 hover:text-stone-800 rounded-md hover:bg-stone-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="inline-flex items-center px-3 py-1.5 border border-[#C5A059] text-xs font-semibold rounded-md text-[#775A19] bg-amber-50 hover:bg-amber-100 transition-colors shadow-sm"
              >
                <User className="w-3.5 h-3.5 mr-1.5" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
