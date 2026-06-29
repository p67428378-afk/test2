import React from "react";

export default function Header({
  user,
  cartCount,
  onCartClick,
  searchQuery,
  setSearchQuery,
}) {
  return (
    <header className="h-16 bg-white border-b border-outline-variant flex items-center justify-between px-8 shadow-sm sticky top-0 z-40">
      <div className="flex items-center gap-6 flex-1">
        {user && user.role === "customer" && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-brand hover:bg-surface-container-high cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">
              location_on
            </span>
            <span className="font-body-md text-body-md text-on-surface text-sm truncate max-w-[200px]">
              Deliver to: 123 Main St, New York
            </span>
            <span className="material-symbols-outlined text-on-surface-variant text-sm">
              expand_more
            </span>
          </div>
        )}
        {setSearchQuery && (
          <div className="relative max-w-md w-full hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for restaurants, cuisines, or dishes..."
              className="w-full h-10 pl-10 pr-4 rounded-full border border-outline-variant bg-surface focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none font-body-md text-sm text-on-surface transition-colors shadow-sm"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user && user.role === "customer" && (
          <button
            onClick={onCartClick}
            className="relative p-2 text-on-surface-variant hover:text-brand-coral transition-colors rounded-full hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-2xl">
              shopping_cart
            </span>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-brand-coral text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        )}
        <div className="flex items-center gap-2 p-1 rounded-full hover:bg-surface-container-high transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-brand-coral text-white flex items-center justify-center font-bold text-sm">
            {user ? user.full_name[0].toUpperCase() : "U"}
          </div>
          <span className="font-label-md text-label-md text-on-surface hidden md:block">
            {user ? user.full_name : "Guest"}
          </span>
        </div>
      </div>
    </header>
  );
}
