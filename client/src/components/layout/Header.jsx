import React from "react";
import { ShoppingCart, User, BookOpen } from "lucide-react";

export default function Header({ cartCount = 0, onNavigate, currentPage }) {
  return (
    <nav className="bg-white dark:bg-surface-container-highest font-body-md text-body-md h-[72px] w-full border-b border-outline-variant/30 backdrop-blur-md bg-white/90 shadow-sm sticky top-0 z-50 transition-colors duration-200">
      <div className="flex items-center justify-between px-md max-w-container-max mx-auto h-full gap-md">
        {/* Left: Logo & Brand */}
        <div
          className="flex items-center gap-sm shrink-0 cursor-pointer active:scale-95 transition-transform"
          onClick={() => onNavigate("catalog")}
        >
          <img
            alt="Hogwarts Library Logo"
            className="h-8 w-8 object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAP9EJ1mNmt_j_x0UmMJ4E6KFMakcB0qnGhriQddJq2zzxX7aqZtY9UXprlWEhl8_E4b3TWxEPUx4soUg29CgkblsPweGgrc2Qe6SHQ4WkF8b5x6_6_nKIOu7UzJAFgPGQtUqacRoB5EzVrCdMOKpFlyMRuDqAcuMuoSuyQQXveATmBMohM6k7MebIjVRPw1l9YYJbnw29K-iU4AqTw8PFabPcHDx2opOG324j8hiamMmDr78q7y6PS_gUpPx56JorKaNMFzHoIR08o"
          />
          <span className="font-headline-md text-headline-md font-bold text-primary">
            Hogwarts Library
          </span>
        </div>

        {/* Center: Search Bar Placeholder */}
        <div className="hidden md:flex flex-1 max-w-2xl relative group">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-gold transition-colors">
            <BookOpen size={18} />
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all text-body-md text-on-surface placeholder:text-on-surface-variant"
            placeholder="Search editions, formats, or ISBNs..."
            type="text"
            disabled
          />
        </div>

        {/* Right: Navigation Links & Actions */}
        <div className="flex items-center gap-md shrink-0">
          <button
            className={`font-label-md cursor-pointer pb-1 border-b-2 transition-all ${currentPage === "catalog" ? "text-primary border-primary" : "text-on-secondary-fixed-variant border-transparent hover:text-primary"}`}
            onClick={() => onNavigate("catalog")}
          >
            Catalog
          </button>
          <button
            className={`font-label-md cursor-pointer pb-1 border-b-2 transition-all ${currentPage === "password-reset" ? "text-primary border-primary" : "text-on-secondary-fixed-variant border-transparent hover:text-primary"}`}
            onClick={() => onNavigate("password-reset")}
          >
            Reset Password
          </button>
          <div className="flex items-center gap-sm ml-sm">
            <button
              className="p-2 text-on-secondary-fixed-variant hover:text-primary-container transition-colors duration-200 cursor-pointer active:scale-95 rounded-full hover:bg-surface-variant/50 relative"
              onClick={() => onNavigate("checkout")}
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-gold text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="p-2 text-on-secondary-fixed-variant hover:text-primary-container transition-colors duration-200 cursor-pointer active:scale-95 rounded-full hover:bg-surface-variant/50"
              aria-label="Profile"
            >
              <User size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
