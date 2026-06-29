import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout({
  user,
  activeTab,
  setActiveTab,
  onLogout,
  cartCount = 0,
  onCartClick,
  searchQuery = "",
  setSearchQuery,
  children,
}) {
  return (
    <div className="flex min-h-screen bg-background text-on-background">
      <Sidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
      />
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <Header
          user={user}
          cartCount={cartCount}
          onCartClick={onCartClick}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <main className="flex-1 p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}
