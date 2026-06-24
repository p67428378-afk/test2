import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md antialiased">
      <Sidebar />
      <Header />
      <main className="ml-[260px] pt-24 px-8 pb-12 w-[calc(100%-260px)] min-h-screen">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-8">
          {children}
        </div>
      </main>
    </div>
  );
}
