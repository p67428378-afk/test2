import React from "react";
import { Landmark, Bell, User } from "lucide-react";

export default function TopAppBar() {
  return (
    <header className="bg-primary-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Landmark className="h-6 w-6 text-sky-300" />
          <span className="font-bold text-lg tracking-tight">
            Apex Mobile Bank
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="p-1 hover:bg-primary-600 rounded-full transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-1 bg-primary-800 px-2 py-1 rounded-full text-xs font-medium">
            <User className="h-4 w-4" />
            <span>Test User</span>
          </div>
        </div>
      </div>
    </header>
  );
}
