import React from "react";
import { User } from "lucide-react";

export default function Header({ title }) {
  const email = localStorage.getItem("user_email") || "User";

  return (
    <header className="fixed top-0 right-0 left-[240px] h-16 bg-white/80 backdrop-blur-md flex justify-between items-center px-8 z-30 border-b border-gray-200 shadow-sm">
      <h1 className="font-bold text-xl text-[#3525cd]">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
          <User className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">{email}</span>
        </div>
      </div>
    </header>
  );
}
