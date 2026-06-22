import React from "react";

export default function Header({ searchQuery, onSearchChange }) {
  return (
    <header className="h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm flex justify-between items-center px-lg w-full sticky top-0 z-40">
      <div className="flex-1 max-w-xl">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-outline">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/50 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface transition-colors shadow-sm"
            placeholder="Search destinations, packages..."
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-4 ml-4">
        <button className="relative p-2 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-full cursor-pointer active:scale-95 transition-transform">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>
        <button className="p-2 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-full cursor-pointer active:scale-95 transition-transform">
          <span className="material-symbols-outlined">settings</span>
        </button>
        <button className="flex items-center gap-2 pl-2">
          <img
            className="w-8 h-8 rounded-full object-cover ring-2 ring-surface-container-highest"
            alt="User Avatar"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKp9uQFXro3T7BFmBBHHNFO6FwpKV1IGk53czTXMtnkgujRy0ERSXzUryhG59O5ZZ1WJilDi3Vib6ruHenQ9CBi5mJKnZvKm-TRWu65oOPEZApZuZ3HJfzjRTCpyJ-HodJbv1JebHjPVHorrchlYBUnGy0F99Isn0LdUijpr4suQc4SSofGaPUQi-Tb0CVeMCAXBC6xiSuTRbQLBl_Ewo-piORkOFmMfdPLZgMC_NuDXKufPkvAoZ4O0yqbD1Q0TdO3WlbvyHmyO8"
          />
          <span className="material-symbols-outlined text-on-surface-variant text-sm">
            expand_more
          </span>
        </button>
      </div>
    </header>
  );
}
