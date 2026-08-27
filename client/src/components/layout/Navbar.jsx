import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Briefcase, Mail } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-[#E3E8F0] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition-colors">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="font-bold text-xl text-blue-600 tracking-tight">
                DevPortfolio
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  isActive("/")
                    ? "text-blue-600 font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Featured Projects
              </Link>
              <a
                href="/#skills"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Skills &amp; Tech Stack
              </a>
              <a
                href="/#reviews"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Client Reviews
              </a>
              <Link
                to="/contact"
                className={`text-sm font-medium transition-colors ${
                  isActive("/contact")
                    ? "text-blue-600 font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Contact
              </Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Get In Touch</span>
            </Link>
          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Featured Projects
          </Link>
          <a
            href="/#skills"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
          >
            Skills &amp; Tech Stack
          </a>
          <a
            href="/#reviews"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
          >
            Client Reviews
          </a>
          <Link
            to="/contact"
            onClick={() => setIsMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/contact")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Contact
          </Link>
          <div className="pt-2">
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm"
            >
              <Mail className="w-4 h-4" />
              <span>Get In Touch</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
