import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Award, BarChart2 } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? "text-primary font-semibold"
      : "text-text_secondary hover:text-primary";
  };

  return (
    <nav className="bg-white border-b border-[#e3e8f0] px-6 py-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-primary font-bold text-xl"
        >
          <BookOpen className="size-6" />
          <span>FlashcardApp</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link
            to="/"
            className={`flex items-center gap-1 transition-colors ${isActive("/")}`}
          >
            <BookOpen className="size-4" />
            <span>Decks</span>
          </Link>
          <span className="text-text_secondary text-xs bg-gray-100 px-2 py-1 rounded-full">
            Test Account: test@example.com / testpassword
          </span>
        </div>
      </div>
    </nav>
  );
}
