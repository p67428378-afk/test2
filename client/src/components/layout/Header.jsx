import React from 'react';
import { Search, Bell, Plus } from 'lucide-react';

function Header() {
  return (
    <header className="fixed top-0 right-0 h-[64px] w-[calc(100%-260px)] z-50 bg-surface-container border-b border-outline-variant flex justify-between items-center px-gutter-desktop">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
          <input
            className="w-full bg-surface-dim border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
            placeholder="Search bookings, treks, or clients..."
            type="text"
          />
        </div>
      </div>

      {/* Trailing Actions */}
      <div className="flex items-center gap-4">
        <button className="bg-primary-container text-white px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-primary transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Set Availability
        </button>
        <button className="relative p-2 text-on-surface-variant hover:text-primary transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full ring-2 ring-surface-container"></span>
        </button>
        <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant cursor-pointer">
          <img
            alt="Guide profile picture"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtDarzTnY-6zPTl_XUR0oCDPkZrWNAT9lxlfgl5K3CXTsTdJAeaBLx83Ar57QZr49fFDGM4nZqvkreHEkkghhQvChOSWzum5HB22jMSqTra84OFbCuKys1T93Dh2uXlQjxRE8xUsedflHwWU0w-6icPMmTyy-ID6d_mwpBU9p8SPSERq9AkBKebKRiWco5jsdilptlgzT67Cgrz9AJl5Cj8FM8SJ7x07Ox0iVroyMA6IEZLHQK3f7blf49opi3IbntQNVIwJJTN40"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
