import React from "react";
import { ShieldCheck, Truck, Sparkles, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#1A0F0D] text-stone-300 border-t border-[#4A322D] mt-20">
      {/* Cold chain value banner */}
      <div className="bg-[#2D1B18] border-b border-[#4A322D]/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#D4AF37]/10 rounded-full text-[#D4AF37]">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">
                  Cold-Pack Insulated Delivery
                </h4>
                <p className="text-xs text-stone-400">
                  Chocolates preserved below 21°C (70°F) in transit.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#D4AF37]/10 rounded-full text-[#D4AF37]">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">
                  Single-Origin & Rare Estates
                </h4>
                <p className="text-xs text-stone-400">
                  Directly sourced micro-lots with pure flavor profiles.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#D4AF37]/10 rounded-full text-[#D4AF37]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">
                  Melt-Free Guarantee
                </h4>
                <p className="text-xs text-stone-400">
                  Guaranteed fresh, unblemished artisanal arrival.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🍫</span>
              <span className="font-heading text-xl font-bold text-white">
                Cacao Royale
              </span>
            </div>
            <p className="mt-3 text-sm text-stone-400 max-w-sm">
              Curating the world&apos;s most extraordinary cacao harvests,
              single-estate bars, and hand-rolled ganaches.
            </p>
            <div className="mt-4 text-xs text-[#D4AF37]">
              Origin Partners: Madagascar • Ecuador • Venezuela • Peru • Ghana
            </div>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white">
              Navigation
            </h5>
            <ul className="mt-3 space-y-2 text-sm text-stone-400">
              <li>
                <a
                  href="/chocolates"
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Catalog
                </a>
              </li>
              <li>
                <a
                  href="/cart"
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Cart
                </a>
              </li>
              <li>
                <a
                  href="/checkout"
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Checkout
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white">
              Artisan Standards
            </h5>
            <ul className="mt-3 space-y-2 text-sm text-stone-400">
              <li>Cocoa Percentage 50% - 100%</li>
              <li>Thermal Sensitive Cold Packaging</li>
              <li>Organic &amp; Vegan Selections</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Cacao Royale. All rights reserved.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
            <span>for chocolate connoisseurs</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
