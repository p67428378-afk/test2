import React from 'react';
import { Search, Bell } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 right-0 h-[60px] w-[calc(100%-200px)] z-40 bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center px-lg">
      <div className="flex items-center gap-md">
        <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Money Management System</h2>
      </div>
      <div className="flex items-center gap-lg">
        <div className="relative group">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-outline">
            <Search size={20} />
          </span>
          <input
            className="bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-4 py-1.5 text-body-sm focus:outline-none focus:ring-1 focus:ring-primary w-[300px] transition-all"
            placeholder="Search instrument, order, or ticker..."
            type="text"
          />
        </div>
        <div className="flex items-center gap-md">
          <button className="relative active:scale-95 transition-transform">
            <Bell className="text-on-surface-variant" />
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-error ring-2 ring-surface-container-lowest"></span>
          </button>
          <img
            alt="Trader Name Profile"
            className="w-8 h-8 rounded-full border border-outline-variant"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6h4Ld4SaDiGZ4XV6Ej0gim5J5GQatTKgAWRC0wIAn55Nd6w02bQuUOcDBYiNYF6vHNvMkh5HAcpvMVZHpoMoisNNYxdwhfEh5a429cQxmLYK0ldb9EiFUpvUqSdU-84Abb3SGaPNFNscLun85M2J7fb6iuLN_hBR6S8yVKwh9ek8KcQZzVIB_Up0RV-x5YR74FDuGRRsy8kdY7Ekt2-_k6Svb-A0M_7VX-Gco4PqbuQEwle7yKIXNkdeg6BLxaCWbLCuiXD5vdQex"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
