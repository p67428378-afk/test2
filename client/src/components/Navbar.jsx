import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    if (
      path === "/poses" &&
      (location.pathname === "/" || location.pathname === "/poses")
    ) {
      return "text-teal-200 border-b-2 border-teal-300 pb-1 font-semibold";
    }
    if (location.pathname.startsWith(path) && path !== "/poses") {
      return "text-teal-200 border-b-2 border-teal-300 pb-1 font-semibold";
    }
    return "text-white hover:text-teal-200 transition-colors";
  };

  return (
    <header className="bg-teal-900 text-white p-4 shadow-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-label="yoga">
            🧘
          </span>
          <h1 className="text-xl font-bold font-serif tracking-tight">
            YogaFlow Studio
          </h1>
        </Link>
        <nav className="flex gap-6 text-sm font-medium">
          <Link to="/poses" className={isActive("/poses")}>
            Pose Catalog
          </Link>
          <Link to="/routines/new" className={isActive("/routines/new")}>
            Routine Builder
          </Link>
          <Link to="/routines" className={isActive("/routines")}>
            My Routines
          </Link>
          <Link
            to="/practice-history"
            className={isActive("/practice-history")}
          >
            Practice History
          </Link>
        </nav>
      </div>
    </header>
  );
}
