import React from "react";
import Header from "./Header.jsx";
import {
  LayoutDashboard,
  Layers,
  Package,
  CheckSquare,
  History,
} from "lucide-react";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface font-sans antialiased">
      <Header />

      {/* SideNavBar */}
      <nav className="hidden md:flex fixed left-0 top-nav-height h-[calc(100vh-nav-height)] w-64 flex-col z-40 bg-surface-container-low border-r border-outline-variant pt-4">
        <div className="px-4 pb-4 border-b border-outline-variant mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary-container w-8 h-8 rounded flex items-center justify-center font-bold text-sm text-on-primary-container">
              DG
            </div>
            <div>
              <div className="text-sm font-bold text-on-surface">
                Dollar General
              </div>
              <div className="text-body-sm text-secondary">
                Category Management
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          <a
            className="bg-primary-container text-on-primary-container font-bold rounded-full mx-2 flex items-center gap-3 px-4 py-3 transition-all"
            href="#"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-label-md">Dashboard</span>
          </a>

          <a
            className="text-on-surface-variant hover:bg-surface-container-high mx-2 flex items-center gap-3 px-4 py-3 rounded-full transition-all"
            href="#"
          >
            <Layers className="w-5 h-5" />
            <span className="text-label-md">Scenarios</span>
          </a>

          <a
            className="text-on-surface-variant hover:bg-surface-container-high mx-2 flex items-center gap-3 px-4 py-3 rounded-full transition-all"
            href="#"
          >
            <Package className="w-5 h-5" />
            <span className="text-label-md">Inventory</span>
          </a>

          <a
            className="text-on-surface-variant hover:bg-surface-container-high mx-2 flex items-center gap-3 px-4 py-3 rounded-full transition-all"
            href="#"
          >
            <CheckSquare className="w-5 h-5" />
            <span className="text-label-md">Compliance</span>
          </a>

          <a
            className="text-on-surface-variant hover:bg-surface-container-high mx-2 flex items-center gap-3 px-4 py-3 rounded-full transition-all"
            href="#"
          >
            <History className="w-5 h-5" />
            <span className="text-label-md">History</span>
          </a>
        </div>

        <div className="p-4 border-t border-outline-variant">
          <div className="text-xs text-secondary text-center">
            STV Cluster Advisor v1.0
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-[calc(64px+2rem)] md:pl-[calc(256px+2rem)] px-margin-mobile md:pr-margin-desktop pb-margin-desktop min-h-screen">
        <div className="max-w-container-max mx-auto space-y-6">{children}</div>
      </main>
    </div>
  );
}
