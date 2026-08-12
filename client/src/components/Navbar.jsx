import React from "react";
import {
  Palette,
  ShoppingBag,
  Search,
  Sliders,
  Truck,
  Shield,
  LogOut,
  User,
} from "lucide-react";

export default function Navbar({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  cartCount = 0,
  user,
  onLogout,
}) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab("catalog")}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-bold shadow-lg group-hover:scale-105 transition-transform">
            <Palette className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
              Artesan Gallery
            </span>
            <span className="block text-[10px] text-amber-400/70 tracking-widest uppercase font-semibold">
              Original Wall Artwork
            </span>
          </div>
        </div>

        {/* Global Search Autocomplete Bar */}
        <div className="flex-1 max-w-md hidden md:block relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery || ""}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              placeholder="Search paintings, artists, styles (e.g. Abstract Blue)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-full text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400 text-sm transition-all"
            />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === "catalog"
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                : "text-slate-300 hover:text-slate-100 hover:bg-slate-800"
            }`}
          >
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Catalog</span>
          </button>

          <button
            onClick={() => setActiveTab("configurator")}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === "configurator"
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                : "text-slate-300 hover:text-slate-100 hover:bg-slate-800"
            }`}
          >
            <Sliders className="h-4 w-4" />
            <span className="hidden sm:inline">Configurator</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === "orders"
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                : "text-slate-300 hover:text-slate-100 hover:bg-slate-800"
            }`}
          >
            <Truck className="h-4 w-4" />
            <span className="hidden sm:inline">Track Order</span>
          </button>

          <button
            onClick={() => setActiveTab("admin")}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === "admin"
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                : "text-slate-300 hover:text-slate-100 hover:bg-slate-800"
            }`}
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Admin</span>
          </button>

          {/* Cart Icon & Badge */}
          <button
            onClick={() => setActiveTab("cart")}
            className={`relative px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === "cart"
                ? "bg-amber-500 text-slate-950 font-semibold"
                : "text-slate-300 hover:text-slate-100 hover:bg-slate-800"
            }`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs font-bold bg-amber-400 text-slate-950 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <span className="text-xs text-slate-400 hidden xl:inline">
                {user.full_name || user.email}
              </span>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
