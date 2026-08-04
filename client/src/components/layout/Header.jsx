import React from "react";
import { useAssortment } from "../../context/AssortmentContext.jsx";

export default function Header() {
  const { activeTopTab, setActiveTopTab, navigationTabs } = useAssortment();

  const topnavTabs =
    navigationTabs?.topnav_tabs?.length > 0
      ? navigationTabs.topnav_tabs
      : [
          { id: "assortment_advisor", label: "Assortment Advisor" },
          { id: "scenario_modeler", label: "Scenario Modeler" },
          { id: "guardrail_rules", label: "Guardrail Rules" },
          { id: "approval_queue", label: "Approval Queue" },
        ];

  return (
    <header className="flex justify-between items-center w-full px-6 h-16 fixed top-0 z-50 bg-[#19120a] border-b border-[#534434]/50 text-white">
      <div className="flex items-center gap-6">
        <span
          className="text-lg font-black text-amber-500 tracking-tighter cursor-pointer"
          onClick={() => setActiveTopTab("assortment_advisor")}
        >
          Dollar General
        </span>
        <div className="h-6 w-px bg-[#534434]/60 hidden md:block"></div>
        <span className="text-xs text-slate-400 hidden md:block">
          DG Cluster Assortment Advisor Dashboard
        </span>
        <nav
          className="hidden lg:flex items-center gap-6 ml-4 h-full"
          aria-label="Top Navigation"
        >
          {topnavTabs.map((tab) => {
            const isActive = activeTopTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTopTab(tab.id)}
                className={`h-16 flex items-center text-xs font-semibold px-2 transition-colors border-b-2 ${
                  isActive
                    ? "text-amber-500 border-amber-500 font-bold"
                    : "text-slate-300 border-transparent hover:text-amber-400"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden xl:flex flex-col items-end mr-2">
          <span className="text-[11px] text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 font-semibold">
            Small Town Value Cluster - Snacks Category (STV-CLUSTER-01)
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5">
            2026-05-18 14:32 UTC
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            aria-label="Notifications"
            className="text-slate-400 hover:text-amber-400 transition-colors p-1"
          >
            <span className="material-symbols-outlined text-xl">
              notifications
            </span>
          </button>
          <button
            aria-label="Help"
            className="text-slate-400 hover:text-amber-400 transition-colors p-1"
          >
            <span className="material-symbols-outlined text-xl">help</span>
          </button>

          <div className="flex items-center gap-2 ml-2 pl-3 border-l border-[#534434]/60">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-xs">
              CM
            </div>
            <span className="text-xs text-slate-200 hidden md:block font-medium">
              Category Manager (USR-CM-882)
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
