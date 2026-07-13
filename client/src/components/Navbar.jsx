import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const userEmail = authService.getCurrentUserEmail();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <nav className="bg-primary-container text-on-tertiary border-b border-outline-variant/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="font-headline-md text-headline-md text-secondary-fixed-dim font-bold tracking-tight text-xl"
            >
              ChocoFeast
            </Link>
            <div className="hidden md:flex space-x-4 font-label-md text-label-md">
              <Link
                to="/subscribe"
                className="hover:text-secondary-fixed-dim transition-colors py-2 px-3 rounded-md"
              >
                Subscribe
              </Link>
              {isAuthenticated && (
                <Link
                  to="/profile"
                  className="hover:text-secondary-fixed-dim transition-colors py-2 px-3 rounded-md"
                >
                  My Subscription
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 font-label-md text-label-md">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-on-tertiary-container hidden sm:inline">
                  {userEmail}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-surface-container-highest/20 hover:bg-surface-container-highest/40 text-on-tertiary py-2 px-4 rounded-full transition-all text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-secondary-fixed-dim text-on-secondary-fixed-variant hover:bg-secondary-fixed py-2 px-5 rounded-full transition-all text-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
