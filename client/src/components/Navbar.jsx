import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  WashingMachine,
  User,
  ShieldAlert,
  Truck,
  LogOut,
  Shirt,
} from "lucide-react";

export default function Navbar({ currentUser, onLogout }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="flex items-center space-x-2 text-blue-600 font-bold text-xl"
            >
              <div className="p-2 bg-blue-100 rounded-lg">
                <WashingMachine className="h-6 w-6 text-blue-600" />
              </div>
              <span className="tracking-tight text-slate-900">
                SpinCycle <span className="text-blue-600">Pro</span>
              </span>
            </Link>
          </div>

          <nav className="flex space-x-1 sm:space-x-4">
            <Link
              to="/customer"
              className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/customer") || isActive("/")
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Shirt className="h-4 w-4 mr-1.5" />
              Customer Dashboard
            </Link>

            <Link
              to="/operator"
              className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/operator")
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <ShieldAlert className="h-4 w-4 mr-1.5" />
              Operator Portal
            </Link>

            <Link
              to="/driver"
              className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/driver")
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Truck className="h-4 w-4 mr-1.5" />
              Driver Route Portal
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden md:block">
                  <p className="text-xs font-semibold text-slate-800">
                    {currentUser.full_name || "Test User"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {currentUser.email || "test@example.com"}
                  </p>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
              >
                <User className="h-4 w-4 mr-1.5" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
