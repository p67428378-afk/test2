import React from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <div className="flex min-h-screen bg-background text-on-background font-sans antialiased overflow-x-hidden">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Wrapper */}
      <main className="flex-1 ml-[260px] flex flex-col min-h-screen">
        {/* Top Navigation */}
        <Header />

        {/* Dashboard Content */}
        <DashboardPage />
      </main>
    </div>
  );
}
