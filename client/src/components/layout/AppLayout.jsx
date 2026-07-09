import React from "react";
import Header from "./Header.jsx";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4">
          &copy; {new Date().getFullYear()} Dollar General Corporation. All
          rights reserved. Internal Use Only.
        </div>
      </footer>
    </div>
  );
}
