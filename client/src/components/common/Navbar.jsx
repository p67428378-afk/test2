import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ favoritesCount = 0 }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-[#122131] border-b border-[#273647]">
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="text-2xl font-bold text-[#00f0ff] flex items-center gap-2 hover:opacity-90"
        >
          <span>✨</span> NameForge AI
        </Link>
        <nav className="flex gap-6 ml-8">
          <Link
            to="/"
            className={`font-medium transition-colors ${
              isActive("/")
                ? "text-[#00f0ff] border-b-2 border-[#00f0ff] pb-1"
                : "text-[#849495] hover:text-[#d4e4fa]"
            }`}
          >
            Generator
          </Link>
          <Link
            to="/favorites"
            className={`font-medium transition-colors flex items-center gap-1.5 ${
              isActive("/favorites")
                ? "text-[#00f0ff] border-b-2 border-[#00f0ff] pb-1"
                : "text-[#849495] hover:text-[#d4e4fa]"
            }`}
          >
            Favorites ({favoritesCount})
          </Link>
          <Link
            to="/genres"
            className={`font-medium transition-colors ${
              isActive("/genres")
                ? "text-[#00f0ff] border-b-2 border-[#00f0ff] pb-1"
                : "text-[#849495] hover:text-[#d4e4fa]"
            }`}
          >
            Genre Directory
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-3 text-xs text-[#849495]">
        <span className="inline-block w-2 h-2 rounded-full bg-[#00dbe9]"></span>
        <span>Engine Active</span>
      </div>
    </header>
  );
};

export default Navbar;
