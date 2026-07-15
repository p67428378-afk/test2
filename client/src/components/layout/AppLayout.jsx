import React from "react";
import Header from "./Header.jsx";

export default function AppLayout({
  children,
  cartCount,
  onCartClick,
  user,
  onAuthClick,
  onLogout,
}) {
  return (
    <div class="min-h-screen flex flex-col bg-[#f9f9ff] text-[#151c27]">
      <Header
        cartCount={cartCount}
        onCartClick={onCartClick}
        user={user}
        onAuthClick={onAuthClick}
        onLogout={onLogout}
      />
      <main class="flex-1 max-w-7xl mx-auto w-full px-6 py-6 lg:py-10 flex flex-col lg:flex-row gap-6">
        {children}
      </main>
      <footer class="w-full py-6 mt-auto bg-white border-t border-gray-200">
        <div class="flex flex-col md:flex-row justify-between items-center px-6 max-w-7xl mx-auto">
          <span class="text-xs text-gray-500 mb-4 md:mb-0">
            © 2026 BentoBox Creative. All rights reserved.
          </span>
          <div class="flex gap-6">
            <a
              class="text-xs text-gray-500 hover:text-[#006c49] transition-colors"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              class="text-xs text-gray-500 hover:text-[#006c49] transition-colors"
              href="#"
            >
              Terms of Service
            </a>
            <a
              class="text-xs text-gray-500 hover:text-[#006c49] transition-colors"
              href="#"
            >
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
