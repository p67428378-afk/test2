import React from "react";
import { Search, Bell, HelpCircle, Plus, LogOut } from "lucide-react";

export default function Header({
  searchQuery,
  setSearchQuery,
  onOpenAddModal,
  onLogout,
  user,
}) {
  return (
    <header className="bg-[#0b1326] text-[#4edea3] fixed top-0 right-0 w-full md:w-[calc(100%-280px)] h-[64px] border-b border-[#3c4a42] shadow-sm flex justify-between items-center px-6 z-40">
      {/* Search */}
      <div className="flex items-center gap-2 bg-[#1E293B] border border-[#3c4a42] rounded-lg px-4 py-1.5 w-full max-w-md focus-within:border-[#4edea3] focus-within:shadow-[0_0_0_2px_rgba(16,185,129,0.2)] transition-all">
        <Search className="w-5 h-5 text-[#bbcabf]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none outline-none text-[#dae2fd] text-sm w-full placeholder-[#bbcabf] p-0 focus:ring-0"
          placeholder="Search credentials (case-insensitive)..."
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenAddModal}
          className="bg-[#10b981] text-[#002113] font-semibold py-1 px-4 rounded-lg flex items-center gap-1 hover:opacity-90 transition-opacity hidden sm:flex text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Credential
        </button>

        <div className="flex items-center gap-2 text-[#bbcabf]">
          <button className="p-1 hover:text-[#4edea3] transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#ffb4ab] rounded-full"></span>
          </button>
          <button className="p-1 hover:text-[#4edea3] transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Logout / Avatar */}
        <div className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#4edea3] text-[#003824] flex items-center justify-center font-bold">
            {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
          </div>
          <button
            onClick={onLogout}
            className="text-[#bbcabf] hover:text-[#ffb4ab] p-1"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
