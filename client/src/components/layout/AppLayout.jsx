import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-on-background">
      <Sidebar />
      <Header />
      <main className="ml-[260px] mt-[64px] p-margin-desktop min-h-[calc(100vh-64px)] bg-background">
        {children}
      </main>
    </div>
  );
}
