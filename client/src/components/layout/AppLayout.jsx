import React from "react";
import Header from "./Header";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <Header />
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-margin-desktop flex flex-col gap-lg">
        {children}
      </main>
    </div>
  );
}
