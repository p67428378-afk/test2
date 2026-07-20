import React, { useState } from "react";
import Sidebar from "./components/layout/Sidebar.jsx";
import Header from "./components/layout/Header.jsx";
import BookSearchPage from "./pages/BookSearchPage.jsx";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-background text-on-background font-body-lg min-h-screen antialiased flex">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-[280px] flex flex-col min-h-screen">
        {/* Header */}
        <Header onMenuToggle={handleMenuToggle} />

        {/* Page Content */}
        <BookSearchPage />
      </div>
    </div>
  );
}
