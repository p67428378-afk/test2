import React from "react";
import { Bell } from "lucide-react";

export default function Header({ title }) {
  const email = localStorage.getItem("email") || "User";

  return (
    <header className="bg-white border-b border-gray-200 h-16 px-8 flex items-center justify-between sticky top-0 z-10">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-indigo-600 rounded-full"></span>
        </button>

        <div className="h-8 w-px bg-gray-200"></div>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold text-sm">
            {email[0].toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-700 hidden md:inline-block">
            {email}
          </span>
        </div>
      </div>
    </header>
  );
}
