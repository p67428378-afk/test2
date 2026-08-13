import React from "react";
import { Link } from "react-router-dom";

export default function Header({ cartCount = 0 }) {
  return (
    <nav className="bg-surface w-full top-0 sticky border-b border-outline-variant z-50">
      <div className="flex justify-between items-center px-gutter py-4 max-w-container-max mx-auto h-[80px]">
        <div className="flex items-center gap-6">
          <Link className="flex items-center gap-3" to="/">
            <img
              alt="Canvas & Co. Logo"
              className="h-10 w-10 object-contain rounded-full"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqzpoNwIo0z5xqk61xwgVdjq7utAnmYPAvSqw_YZTCqy0gPjaH-0fSOD5OiMxNCBLzJ32jFBKf_yR-XlnyQSyZVFL8LA3L2UJ8sq38OISPZcXTKvvAwKGhlON8FDmZb40Co4M4firEXn3RMrA64P6UEpExk3mW5s_jR1bm_FPvwPWM2Pz1BH61Keum9gbmXAnClrDuORDIAEz1nHCWM0f8_PWXdSt5RxbMStvmaZL-V9vj7U8PU32z3cxo3bazfEOG3KW631Z0Ww"
            />
            <span className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg tracking-tight text-primary">
              Canvas & Co.
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6 ml-8">
            <Link
              className="font-body-md text-body-md text-primary border-b-2 border-primary pb-1 cursor-pointer active:opacity-70"
              to="/"
            >
              Shop
            </Link>
            <span className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-70">
              Artists
            </span>
            <span className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-70">
              Exhibitions
            </span>
            <span className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-70">
              Journal
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
              search
            </span>
            <input
              className="pl-10 pr-4 py-2 border border-outline-variant rounded bg-surface-container-low focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-body-sm text-body-sm w-80 lg:w-96 transition-all"
              placeholder="Search paintings..."
              type="text"
            />
          </div>
          <Link
            aria-label="shopping_cart"
            className="relative p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-70"
            to="/cart"
          >
            <span
              className="material-symbols-outlined"
              data-icon="shopping_cart"
            >
              shopping_cart
            </span>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-error text-on-error rounded-full w-4 h-4 flex items-center justify-center font-label-caps text-[10px]">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            aria-label="person"
            className="p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-70"
          >
            <span className="material-symbols-outlined" data-icon="person">
              person
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
