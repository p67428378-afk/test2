import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  Sliders,
  Sparkles,
  Bookmark,
  User,
  ShoppingCart,
} from "lucide-react";

export default function Navbar({ userId = "user-123", cartCount = 0 }) {
  const location = useLocation();

  const navLinks = [
    { name: "Product Catalog", path: "/", icon: ShoppingBag },
    { name: "Preferences", path: "/preferences", icon: Sliders },
    { name: "AI Recommendations", path: "/recommendations", icon: Sparkles },
    { name: "Saved Items", path: "/recommendations?tab=saved", icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  RecomCommerce
                </span>
                <span className="block text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
                  AI-Powered Shopping
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isSavedTab =
                link.path.includes("tab=saved") &&
                location.pathname === "/recommendations" &&
                location.search.includes("tab=saved");
              const isRecsTab =
                link.path === "/recommendations" &&
                location.pathname === "/recommendations" &&
                !location.search.includes("tab=saved");
              const isCatalog =
                (link.path === "/" &&
                  (location.pathname === "/" ||
                    location.pathname === "/products")) ||
                location.pathname === link.path;
              const isActive =
                isSavedTab ||
                isRecsTab ||
                (link.path !== "/recommendations" &&
                  !link.path.includes("tab=saved") &&
                  isCatalog);

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-slate-500"}`}
                  />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User & Cart Controls */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200 text-xs text-slate-700">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-medium">User:</span>
              <span className="font-bold text-slate-900">{userId}</span>
            </div>

            <div
              className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-indigo-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
