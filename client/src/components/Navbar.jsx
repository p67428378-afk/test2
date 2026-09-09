import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Flower2, BookOpen, PlusCircle, BookmarkCheck } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-teal-900 text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity"
        >
          <div className="w-10 h-10 rounded-full bg-teal-800 flex items-center justify-center text-teal-200 shadow-inner">
            <Flower2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-serif font-bold tracking-tight block">
              YogaFlow Studio
            </span>
            <span className="text-[10px] text-teal-300 font-sans tracking-widest uppercase block -mt-1">
              Pose & Routine Dictionary
            </span>
          </div>
        </Link>

        <nav className="flex gap-1 sm:gap-2 text-sm font-medium">
          <Link
            to="/"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
              isActive("/") &&
              location.pathname !== "/routines" &&
              location.pathname !== "/routines/new"
                ? "bg-teal-800 text-teal-200 border-b-2 border-teal-300 font-semibold"
                : "text-teal-100 hover:bg-teal-800/60"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Pose Catalog</span>
          </Link>

          <Link
            to="/routines/new"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
              isActive("/routines/new")
                ? "bg-teal-800 text-teal-200 border-b-2 border-teal-300 font-semibold"
                : "text-teal-100 hover:bg-teal-800/60"
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Routine Builder</span>
          </Link>

          <Link
            to="/routines"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
              isActive("/routines") &&
              !location.pathname.startsWith("/routines/new")
                ? "bg-teal-800 text-teal-200 border-b-2 border-teal-300 font-semibold"
                : "text-teal-100 hover:bg-teal-800/60"
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>My Routines</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
