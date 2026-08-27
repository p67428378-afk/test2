import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { name: "Calculator", path: "/" },
    { name: "Breakdown Details", path: "/breakdown" },
  ];

  return (
    <header
      className="bg-white border border-[#e3e8f0] border-solid flex items-center justify-between px-6 py-4 w-full rounded-xl shadow-sm mb-6"
      data-node-id="1:4"
      data-name="Navbar"
    >
      <div className="flex gap-6 items-center">
        <Link
          to="/"
          className="font-bold text-[#2663eb] text-xl tracking-wide flex items-center gap-1 hover:opacity-90"
          data-node-id="1:6"
        >
          <span>SPLI&TIP</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors ${
                  isActive
                    ? "text-[#2663eb] font-semibold border-b-2 border-[#2663eb] pb-0.5"
                    : "text-[#707a8c] hover:text-[#171c29]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-3" data-name="UserActions">
        <div
          title="Quick Tip: Standard tip is 15-20% for good service."
          className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f2f5fa] text-[#707a8c] text-lg cursor-help hover:bg-[#e3e8f0] transition-colors"
        >
          💡
        </div>
      </div>
    </header>
  );
}
