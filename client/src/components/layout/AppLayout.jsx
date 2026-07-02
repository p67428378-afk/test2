import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";

export default function AppLayout({
  children,
  activeTab,
  setActiveTab,
  activeAlertCount = 0,
  searchQuery,
  setSearchQuery,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#0F172A] text-[#dae2fd] font-sans antialiased">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsMobileMenuOpen(false);
        }}
        activeAlertCount={activeAlertCount}
      />

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="relative w-[260px] h-full bg-[#0F172A] border-r border-outline-variant">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setIsMobileMenuOpen(false);
              }}
              activeAlertCount={activeAlertCount}
            />
          </div>
        </div>
      )}

      {/* Main Content Wrapper */}
      <div className="flex-1 ml-0 md:ml-[260px] flex flex-col min-h-screen">
        <Header
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <main className="flex-1 p-4 md:p-10 max-w-[1440px] mx-auto w-full flex flex-col gap-6">
          {children}
        </main>
      </div>
    </div>
  );
}
