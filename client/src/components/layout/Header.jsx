import React from "react";

export default function Header({
  cartCount,
  onCartClick,
  user,
  onAuthClick,
  onLogout,
}) {
  return (
    <nav
      aria-label="Main Navigation"
      class="w-full sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100"
    >
      <div class="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto h-[64px]">
        {/* Brand */}
        <div class="flex items-center gap-6 flex-1">
          <a class="flex items-center gap-2" href="#">
            <img
              alt="BentoBox Creative Logo"
              class="h-8 w-8 object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYZZdzOPURWeioNZjf05o4Mhx5svFC4SK0c8gX0ZMQClC8nSjVILwTftiNZeUciw64V3iurL_AsVLV7578Xx5cB2tVTmz6LcXS9zf68Q8rzflActXnD0t5mYbKdL_Ou4o4jtLJAfYCYLETaMjVsX9NvpBcC2g16x5YVUQIQmGRvgVR8JZjWlxGJ0_XIe17epqm3Nw7F1uTL63rPKOePkvREuvfz3w_8q3-dRUGApakUrTtUCFoqVu1KnsG9lB_Lgm-5tLE5_i5dzV8"
            />
            <span class="font-bold text-xl text-[#006c49]">
              BentoBox Creative
            </span>
          </a>
        </div>

        {/* Trailing Icons */}
        <div class="flex items-center gap-4 ml-6">
          <button
            onClick={onCartClick}
            class="relative p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors active:scale-95"
            aria-label="Shopping Cart"
          >
            <span class="material-symbols-outlined">shopping_cart</span>
            {cartCount > 0 && (
              <span class="absolute top-0 right-0 bg-[#ba1a1a] text-white text-[10px] font-semibold w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div class="flex items-center gap-2">
              <button
                onClick={onAuthClick}
                class="flex items-center gap-1 p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors active:scale-95"
              >
                <span class="material-symbols-outlined">account_circle</span>
                <span class="hidden sm:inline text-sm font-medium">
                  {user.email}
                </span>
              </button>
              <button
                onClick={onLogout}
                class="text-xs text-gray-500 hover:text-red-600 px-2 py-1 rounded hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              class="flex items-center gap-1 px-3 py-1.5 bg-[#006c49] text-white rounded-lg text-sm font-medium hover:bg-[#005236] transition-colors active:scale-95"
            >
              <span class="material-symbols-outlined text-lg">login</span>
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
