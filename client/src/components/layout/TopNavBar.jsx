import React from "react";
import { Search, Cpu, ShoppingCart, Menu } from "lucide-react";

export default function TopNavBar({
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  categories = [],
  selectedCategory,
  setSelectedCategory,
  onNavigate,
  currentView,
}) {
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearchSubmit();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onNavigate("homepage")}
        >
          <Cpu className="h-6 w-6 text-cyan-400" />
          <span className="text-lg font-bold tracking-tight text-slate-100">
            PartForge
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4 md:mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search CPUs, GPUs, Motherboards..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              className="w-full rounded-full bg-slate-900 pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-400 border border-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              setSelectedCategory(null);
              onNavigate("listings");
            }}
            className={`hover:text-cyan-400 transition-colors ${
              currentView === "listings" && !selectedCategory
                ? "text-cyan-400"
                : ""
            }`}
          >
            All Products
          </button>
          {categories.slice(0, 4).map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                onNavigate("listings");
              }}
              className={`hover:text-cyan-400 transition-colors ${
                selectedCategory === cat.id ? "text-cyan-400" : ""
              }`}
            >
              {cat.name}
            </button>
          ))}
        </nav>

        {/* Cart / Actions */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-400 hover:text-cyan-400 transition-colors">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950 flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
