import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FileText, PlusCircle, FolderGit2, Sparkles } from "lucide-react";

export default function Navbar({ documentCount = 0 }) {
  const location = useLocation();

  const isEditor = location.pathname.startsWith("/editor");
  const isLibrary =
    location.pathname === "/" || location.pathname === "/library";

  return (
    <header className="bg-white border-b border-[#E3E8F0] sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="flex items-center space-x-2.5 text-brand-blue group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-[#171C29]">
                  Markdown<span className="text-brand-blue">Studio</span>
                </span>
                <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-xs font-semibold uppercase bg-blue-50 text-brand-blue rounded-full">
                  v1.0
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-2 sm:space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isLibrary
                  ? "bg-blue-50 text-brand-blue"
                  : "text-[#707A8C] hover:text-[#171C29] hover:bg-gray-100"
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>Library</span>
              {documentCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-gray-200 text-gray-700 text-xs rounded-full">
                  {documentCount}
                </span>
              )}
            </Link>

            <Link
              to="/editor"
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isEditor && !location.state?.fromLibrary
                  ? "bg-brand-blue text-white shadow-sm hover:bg-blue-700"
                  : "bg-brand-blue text-white shadow-sm hover:bg-blue-700"
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Document</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
