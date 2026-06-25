import React from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-on-background font-body-md antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Top Navigation Header */}
      <Header />

      {/* Main Content Canvas */}
      <main className="ml-[280px] pt-16 min-h-screen">
        <DashboardPage />
      </main>
    </div>
  );
}
