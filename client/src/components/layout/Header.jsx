import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Search,
  Bell,
  Menu,
  ShieldAlert,
  LogOut,
} from "lucide-react";
import { adminService } from "../../services/api";

export default function Header() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAdminLoggedIn = !!localStorage.getItem("admin_token");

  const handleLogout = () => {
    adminService.logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-outline-variant/20 backdrop-blur-md shadow-sm">
      <div className="flex justify-between items-center h-16 w-full max-w-max-width mx-auto px-gutter">
        {/* Brand Logo */}
        <Link className="flex items-center gap-2" to="/">
          <span className="material-symbols-outlined text-primary text-3xl">
            diversity_3
          </span>
          <span className="font-headline-md text-headline-md font-bold text-primary">
            CommuniLink
          </span>
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link
            className="text-primary font-bold border-b-2 border-primary pb-1"
            to="/"
          >
            Explore
          </Link>
          <Link
            className="text-on-surface-variant hover:text-primary transition-colors"
            to="/"
          >
            Categories
          </Link>
          <Link
            className="text-on-surface-variant hover:text-primary transition-colors"
            to="/"
          >
            Calendar
          </Link>
          <Link
            className="text-on-surface-variant hover:text-primary transition-colors"
            to="/"
          >
            Venues
          </Link>
          <Link
            className="text-on-surface-variant hover:text-primary transition-colors"
            to="/"
          >
            About
          </Link>
        </nav>

        {/* Trailing Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-2">
            <button className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors flex items-center justify-center">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Portal / Dashboard Link */}
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link
                className="hidden md:inline-flex px-4 py-2 bg-primary text-white hover:bg-surface-tint rounded-md font-label-md transition-colors"
                to="/admin"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="hidden md:inline-flex px-3 py-2 border border-error text-error hover:bg-error-container/20 rounded-md font-label-md transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              className="hidden md:inline-flex px-4 py-2 border-2 border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488] hover:text-white rounded-md font-label-md transition-colors active:scale-95 duration-200"
              to="/admin"
            >
              Admin Portal
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-on-surface-variant p-2 flex items-center justify-center"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-outline-variant/20 px-gutter py-4 flex flex-col gap-4">
          <Link
            className="text-primary font-bold"
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Explore
          </Link>
          <Link
            className="text-on-surface-variant"
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Categories
          </Link>
          <Link
            className="text-on-surface-variant"
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Calendar
          </Link>
          <Link
            className="text-on-surface-variant"
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Venues
          </Link>
          <Link
            className="text-on-surface-variant"
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
          <hr className="border-outline-variant/20" />
          {isAdminLoggedIn ? (
            <>
              <Link
                className="text-primary font-bold"
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="text-error font-bold text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              className="text-[#0D9488] font-bold"
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Admin Portal
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
