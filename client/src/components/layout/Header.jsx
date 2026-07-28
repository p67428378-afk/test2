import React from "react";
import { Bell, Plus, Search, User } from "lucide-react";
import { authService } from "../../services/api";

export default function Header({ onNewCaseClick, onUploadEvidenceClick }) {
  const currentUser = authService.getCurrentUser();

  return (
    <header className="fixed top-0 right-0 h-16 left-[260px] bg-[#171f33]/90 backdrop-blur-md border-b border-[#464554] shadow-sm flex justify-between items-center px-6 z-10">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c7c4d7] h-4 w-4" />
        <input
          className="w-full bg-[#0F172A] border border-[#334155] rounded-md py-2 pl-10 pr-16 text-sm text-[#dae2fd] focus:outline-none focus:border-[#c0c1ff] focus:ring-1 focus:ring-[#c0c1ff] shadow-inner placeholder-[#c7c4d7]/50"
          placeholder="Search cases, evidence, logs..."
          type="text"
          disabled
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[#c7c4d7]/50 bg-[#1E293B] px-1.5 py-0.5 rounded border border-[#334155]">
          CMD+K
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="text-[#c7c4d7] hover:text-[#c0c1ff] transition-colors active:opacity-80 relative p-1 rounded-full hover:bg-[#2d3449]">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#ffb4ab] rounded-full"></span>
        </button>

        {currentUser &&
          (currentUser.role === "Administrator" ||
            currentUser.role === "Investigator") && (
            <>
              <button
                onClick={onNewCaseClick}
                className="bg-[#c0c1ff] text-[#07006c] px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#e1e0ff] transition-colors active:opacity-80 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Case
              </button>

              <button
                onClick={onUploadEvidenceClick}
                className="bg-[#4edea3] text-[#002113] px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#6ffbbe] transition-colors active:opacity-80 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Upload Evidence
              </button>
            </>
          )}

        <div className="h-8 w-8 rounded-full bg-[#2d3449] flex items-center justify-center overflow-hidden border border-[#464554] cursor-pointer ml-2">
          <User className="h-5 w-5 text-[#c7c4d7]" />
        </div>
      </div>
    </header>
  );
}
