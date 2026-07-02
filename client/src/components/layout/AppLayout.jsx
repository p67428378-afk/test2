import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout({ children, title }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
