import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Utensils, Heart, PlusCircle, LogIn, LogOut, User } from "lucide-react";

export default function Navbar({ currentUser, onOpenAuthModal, onLogout }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-[#e3e8f0] sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-[#e05929] font-bold text-xl hover:opacity-90 transition"
        >
          <Utensils className="w-6 h-6" />
          <span>RecipeVault</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            to="/"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition ${
              isActive("/")
                ? "text-[#e05929] bg-[#f7fafc] font-semibold"
                : "text-gray-700 hover:text-[#e05929]"
            }`}
          >
            Explore
          </Link>
          <Link
            to="/favorites"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition ${
              isActive("/favorites")
                ? "text-[#e05929] bg-[#f7fafc] font-semibold"
                : "text-gray-700 hover:text-[#e05929]"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Collections</span>
          </Link>
          <Link
            to="/recipes/create"
            className="flex items-center gap-1.5 bg-[#e05929] hover:bg-[#c8491f] text-white px-4 py-2 rounded-lg transition font-medium shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Recipe</span>
          </Link>
        </nav>

        {/* Auth / Profile section */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                <User className="w-4 h-4 text-[#e05929]" />
                <span className="font-medium truncate max-w-[120px]">
                  {currentUser.username ||
                    currentUser.email?.split("@")[0] ||
                    "User"}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-gray-100 transition"
                title="Log out"
                aria-label="Log out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 text-[#e05929] border border-[#e05929] hover:bg-[#e05929] hover:text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
