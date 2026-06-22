import React from "react";
import { NavLink, Link } from "react-router-dom";

export default function Sidebar({ user, onLogout }) {
  return (
    <nav className="fixed left-0 top-0 h-full w-[260px] bg-inverse-surface border-r border-outline-variant/10 shadow-xl flex flex-col py-6 z-50">
      <div className="px-6 mb-8 flex items-center gap-3">
        <span
          className="material-symbols-outlined text-primary-fixed text-3xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          flight_takeoff
        </span>
        <div>
          <h1 className="font-display text-display text-primary-container tracking-tight text-2xl font-bold">
            RoamEase
          </h1>
          <p className="font-label-sm text-label-sm text-surface-variant opacity-70">
            Travel Explorer
          </p>
        </div>
      </div>

      <ul className="flex flex-col gap-2 mt-4 flex-1">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 transition-all duration-200 ease-in-out border-l-4 ${
                isActive
                  ? "text-primary-container border-primary-container bg-primary-container/10"
                  : "text-surface-variant hover:text-on-tertiary-fixed hover:bg-white/5 border-transparent"
              }`
            }
          >
            <span className="material-symbols-outlined">explore</span>
            <span className="font-label-md text-label-md">
              Explore Packages
            </span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/compare"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 transition-all duration-200 ease-in-out border-l-4 ${
                isActive
                  ? "text-primary-container border-primary-container bg-primary-container/10"
                  : "text-surface-variant hover:text-on-tertiary-fixed hover:bg-white/5 border-transparent"
              }`
            }
          >
            <span className="material-symbols-outlined">compare_arrows</span>
            <span className="font-label-md text-label-md">
              Compare Packages
            </span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 transition-all duration-200 ease-in-out border-l-4 ${
                isActive
                  ? "text-primary-container border-primary-container bg-primary-container/10"
                  : "text-surface-variant hover:text-on-tertiary-fixed hover:bg-white/5 border-transparent"
              }`
            }
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label-md text-label-md">My Dashboard</span>
          </NavLink>
        </li>
      </ul>

      <div className="mt-auto px-4">
        {user ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 p-3 rounded-lg border border-outline-variant/10 bg-white/5">
              <img
                className="w-10 h-10 rounded-full object-cover shadow-sm"
                alt="User Avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv1b6dgzVlHWmtitMl2jc0doBw22_hQU6Py88xzyixQRgFLXmSUSkt6XUzUXuL3Pm1f9c7Z1TeYHPaLLKPqtpcFK-GG6v-Eg_8skvLuoVkvUKTACMOreO4AkEAIfoZa6vcBcem1WaE8H3IMIe0gcr4L6ZdLslL1sXzpmX5fxDL-S3_XT0KRpX5TlBOHt3rIqX2f2edee0DNqfw6J4hWnvr4D-SX5WYA9VdXw5ej9QeHXfJn_I1D8RzTJPhUHjMNUHyS7QjLzF5g8c"
              />
              <div className="flex flex-col overflow-hidden">
                <span className="font-label-md text-label-md text-surface-container-lowest truncate">
                  {user.name}
                </span>
                <span className="font-label-sm text-label-sm text-surface-variant opacity-70 truncate">
                  {user.email}
                </span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full py-2 px-3 bg-error/20 hover:bg-error/30 text-error-container rounded-lg font-label-sm text-label-sm transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 p-3 rounded-lg bg-primary-container text-on-primary hover:bg-primary-container/90 transition-colors font-label-md text-label-md"
          >
            <span className="material-symbols-outlined text-sm">login</span>
            Login / Register
          </Link>
        )}
      </div>
    </nav>
  );
}
