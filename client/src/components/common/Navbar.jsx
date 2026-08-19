import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShieldCheck,
  PlusCircle,
  ClipboardList,
  LayoutDashboard,
} from "lucide-react";

export default function Navbar({ onOpenRegisterModal }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-2 text-primary font-bold text-xl"
            >
              <ShieldCheck className="h-8 w-8 text-primary" />
              <span className="text-gray-900 font-extrabold tracking-tight">
                Warranty Tracker
              </span>
            </Link>

            <div className="hidden md:flex space-x-4">
              <Link
                to="/"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/")
                    ? "bg-blue-50 text-primary"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
              <Link
                to="/claims"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/claims")
                    ? "bg-blue-50 text-primary"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                Service Claims
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
              <span className="font-semibold text-gray-700 mr-1">
                Test User:
              </span>{" "}
              test@example.com
            </div>

            {onOpenRegisterModal && (
              <button
                onClick={onOpenRegisterModal}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-hover shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Register Product
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
