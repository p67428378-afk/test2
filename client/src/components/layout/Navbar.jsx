import React from "react";
import { NavLink, Link } from "react-router-dom";
import { FileText, BookOpen, Plus, Sparkles, ShieldCheck } from "lucide-react";

export default function Navbar({ onNewDocument }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
                  Markdown Studio
                  <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                    Live
                  </span>
                </span>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Real-time Markdown & HTML Preview
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`
              }
              end
            >
              <FileText className="w-4 h-4" />
              <span>Editor</span>
            </NavLink>

            <NavLink
              to="/documents"
              className={({ isActive }) =>
                `flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`
              }
            >
              <BookOpen className="w-4 h-4" />
              <span>Library</span>
            </NavLink>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-1 text-xs text-green-700 bg-green-50 px-2.5 py-1.5 rounded-full border border-green-200">
              <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
              <span className="font-medium">XSS Sanitized</span>
            </div>

            {onNewDocument ? (
              <button
                onClick={onNewDocument}
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-sm font-medium shadow-sm transition hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Document</span>
              </button>
            ) : (
              <Link
                to="/"
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-sm font-medium shadow-sm transition hover:shadow"
              >
                <Plus className="w-4 h-4" />
                <span>New Document</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
