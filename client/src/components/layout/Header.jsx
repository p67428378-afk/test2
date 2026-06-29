import React from "react";
import PropTypes from "prop-types";

export default function Header({ user, isOnline, onToggleOnline }) {
  return (
    <header className="h-16 bg-white border-b border-outline-variant flex items-center justify-between px-8 shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="font-headline-md text-on-surface text-lg font-bold">
          Welcome back,{" "}
          <span className="text-brand-coral">{user?.full_name || "User"}</span>
        </h2>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary-container text-on-secondary-container capitalize">
          {user?.role || "Guest"}
        </span>
      </div>

      <div className="flex items-center gap-6">
        {user?.role === "delivery" && (
          <div className="flex items-center gap-3 bg-surface-container px-4 py-1.5 rounded-full border border-outline-variant">
            <span
              className={`w-2.5 h-2.5 rounded-full ${isOnline ? "bg-brand-green" : "bg-secondary"}`}
            ></span>
            <span className="font-label-sm text-xs text-on-surface-variant font-medium">
              {isOnline ? "Online & Available" : "Offline"}
            </span>
            <button
              onClick={() => onToggleOnline(!isOnline)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                isOnline
                  ? "bg-secondary text-white hover:bg-secondary/90"
                  : "bg-brand-green text-white hover:bg-brand-green/90"
              }`}
            >
              {isOnline ? "Go Offline" : "Go Online"}
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-coral text-white flex items-center justify-center font-bold text-sm uppercase">
            {user?.full_name ? user.full_name.charAt(0) : "U"}
          </div>
          <div className="hidden md:block text-left">
            <p className="font-label-md text-sm text-on-surface font-semibold leading-none">
              {user?.full_name}
            </p>
            <p className="font-label-sm text-xs text-on-surface-variant mt-0.5">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  user: PropTypes.shape({
    full_name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
  }),
  isOnline: PropTypes.bool,
  onToggleOnline: PropTypes.func,
};
