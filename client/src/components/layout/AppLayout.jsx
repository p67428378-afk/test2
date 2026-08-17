import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout({ title, children }) {
  return (
    <div className="flex min-h-screen bg-[#f9f9ff]">
      <Sidebar />
      <div className="ml-[240px] w-[calc(100%-240px)] flex flex-col min-h-screen">
        <Header title={title} />
        <main className="mt-16 p-8 flex-1 overflow-y-auto max-w-[1440px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
