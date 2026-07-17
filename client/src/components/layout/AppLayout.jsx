import React from "react";
import { Layout, Shield, Settings, Layers, HelpCircle } from "lucide-react";

export default function AppLayout({
  children,
  currentSubject,
  onSubjectChange,
  subjects,
}) {
  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className="w-[260px] bg-[#0b1326] border-r border-[#3c4a42]/30 flex flex-col py-6 shrink-0">
        {/* Brand */}
        <div className="px-6 mb-8 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-all">
          <div className="w-8 h-8 rounded bg-[#4edea3] flex items-center justify-center shrink-0">
            <Layout className="text-[#0b1326] w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#4edea3]">SchemaFlow</h1>
            <p className="text-xs text-[#bbcabf]">Avro Registry</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 px-2">
          <button className="flex items-center gap-3 px-4 py-3 text-[#dae2fd] font-bold border-l-4 border-[#4edea3] bg-[#2d3449] text-left w-full">
            <Layout className="text-[#4edea3] w-5 h-5" />
            <span>Dashboard</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-[#bbcabf] hover:text-[#4edea3] hover:bg-[#222a3d] transition-colors text-left w-full border-l-4 border-transparent">
            <Layers className="w-5 h-5" />
            <span>Schemas</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-[#bbcabf] hover:text-[#4edea3] hover:bg-[#222a3d] transition-colors text-left w-full border-l-4 border-transparent">
            <Shield className="w-5 h-5" />
            <span>Compatibility Rules</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-[#bbcabf] hover:text-[#4edea3] hover:bg-[#222a3d] transition-colors text-left w-full border-l-4 border-transparent">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </nav>

        {/* Footer Profile */}
        <div className="mt-auto px-6 pt-6 border-t border-[#3c4a42]/30">
          <div className="flex items-center gap-3 text-[#bbcabf] p-2 -mx-2 rounded hover:bg-[#222a3d] transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#171f33] flex items-center justify-center shrink-0 border border-[#3c4a42]/30">
              <span className="text-xs font-bold">AM</span>
            </div>
            <span className="text-sm truncate">Alex Mercer</span>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-[#0b1326] border-b border-[#3c4a42]/30 flex justify-between items-center px-8 shrink-0">
          <div className="flex items-center gap-6 flex-1">
            <div className="flex items-center gap-2 text-xs text-[#bbcabf]">
              <span className="hover:text-[#4edea3] cursor-pointer">
                Schemas
              </span>
              <span className="text-sm">/</span>
              <span className="text-[#dae2fd] font-semibold">
                {currentSubject || "user-events"}
              </span>
            </div>

            {/* Subject Selector */}
            <div className="relative ml-4">
              <select
                value={currentSubject}
                onChange={(e) => onSubjectChange(e.target.value)}
                className="bg-[#0F172A] border border-[#334155] rounded py-1 px-3 text-sm text-[#dae2fd] focus:outline-none focus:border-[#10b981] transition-all"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name} ({sub.compatibility_level})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Trailing Actions */}
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 flex items-center justify-center text-[#bbcabf] hover:text-[#4edea3] transition-colors rounded-full hover:bg-[#222a3d]">
              <HelpCircle className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#3c4a42]/30 ml-2 cursor-pointer hover:border-[#4edea3] transition-colors">
              <div className="w-full h-full bg-[#10b981] flex items-center justify-center text-white font-bold text-xs">
                AM
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1440px] mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
