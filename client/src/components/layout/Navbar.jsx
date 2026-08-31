import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Sparkles, ThermometerSnowflake } from "lucide-react";
import { useCart } from "../../context/CartContext";

export const Navbar = () => {
  const { itemCount, openDrawer } = useCart();
  const location = useLocation();

  const isActive = (path) => {
    if (
      path === "/chocolates" &&
      (location.pathname === "/" || location.pathname === "/chocolates")
    ) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#2D1B18]/95 backdrop-blur-md border-b border-[#4A322D] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#1A0F0D] font-bold shadow-inner group-hover:scale-105 transition-transform">
              <span className="text-xl">🍫</span>
            </div>
            <div>
              <span className="font-heading text-2xl font-bold tracking-wide text-white group-hover:text-[#D4AF37] transition-colors">
                Cacao Royale
              </span>
              <span className="block text-[11px] font-sans tracking-widest text-[#D4AF37]/90 uppercase">
                Artisanal Exotic Chocolatier
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/chocolates"
              className={`text-sm font-medium transition-colors hover:text-[#D4AF37] flex items-center space-x-1.5 ${
                isActive("/chocolates")
                  ? "text-[#D4AF37] font-semibold border-b-2 border-[#D4AF37] pb-1"
                  : "text-stone-300"
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Exotic Catalog</span>
            </Link>
            <Link
              to="/cart"
              className={`text-sm font-medium transition-colors hover:text-[#D4AF37] ${
                isActive("/cart")
                  ? "text-[#D4AF37] font-semibold"
                  : "text-stone-300"
              }`}
            >
              Shopping Cart
            </Link>
          </nav>

          {/* Action Header Items */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center text-xs text-[#F4E8C1] bg-[#4A322D]/60 px-3 py-1.5 rounded-full border border-[#D4AF37]/30">
              <ThermometerSnowflake className="w-3.5 h-3.5 text-[#00796B] mr-1.5" />
              <span>Thermal Climate Controlled Shipping</span>
            </div>

            {/* Cart Button */}
            <button
              onClick={openDrawer}
              data-testid="cart-button"
              className="relative p-2.5 rounded-full bg-[#4A322D] hover:bg-[#D4AF37] hover:text-[#1A0F0D] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              aria-label="Open shopping cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span
                  data-testid="cart-badge-count"
                  className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#1A0F0D] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow"
                >
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
