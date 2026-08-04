import React from "react";
import { useAssortment } from "../../context/AssortmentContext.jsx";

export default function Sidebar() {
  const {
    activeSidebarTab,
    setActiveSidebarTab,
    setActiveTopTab,
    navigationTabs,
    handleSelectScenario,
  } = useAssortment();

  const sidebarTabs =
    navigationTabs?.sidebar_tabs?.length > 0
      ? navigationTabs.sidebar_tabs
      : [
          { id: "overview", label: "Overview", icon: "dashboard" },
          {
            id: "category_strategy",
            label: "Category Strategy",
            icon: "strategy",
          },
          {
            id: "sku_performance",
            label: "SKU Performance",
            icon: "analytics",
          },
          { id: "store_clusters", label: "Store Clusters", icon: "group_work" },
          { id: "audit_history", label: "Audit History", icon: "history" },
        ];

  const handleTabClick = (tabId) => {
    setActiveSidebarTab(tabId);
    // Switch to assortment advisor canvas when clicking sidebar tabs
    setActiveTopTab("assortment_advisor");
  };

  const getIconName = (tabId, serverIcon) => {
    if (serverIcon) {
      if (serverIcon === "LayoutDashboard") return "dashboard";
      if (serverIcon === "Target") return "strategy";
      if (serverIcon === "BarChart3") return "analytics";
      if (serverIcon === "Store") return "group_work";
      if (serverIcon === "History") return "history";
    }
    switch (tabId) {
      case "overview":
        return "dashboard";
      case "category_strategy":
        return "strategy";
      case "sku_performance":
        return "analytics";
      case "store_clusters":
        return "group_work";
      case "audit_history":
        return "history";
      default:
        return "label";
    }
  };

  return (
    <aside
      className="hidden md:flex flex-col py-4 fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-[#261e15] border-r border-[#534434]/50 z-40 text-white"
      aria-label="Sidebar Navigation"
    >
      <div className="px-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded bg-[#1E293B] flex items-center justify-center border border-[#334155]">
            <span className="material-symbols-outlined text-amber-500">
              group_work
            </span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-amber-500">Active Cluster</h2>
            <p className="text-xs text-slate-400">SE-Premium-V2</p>
          </div>
        </div>
        <button
          onClick={() => {
            handleSelectScenario("Balanced");
            setActiveTopTab("scenario_modeler");
          }}
          className="w-full py-2 px-4 bg-amber-500 text-slate-950 font-bold rounded text-xs hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 shadow"
        >
          <span className="material-symbols-outlined text-base">add</span>
          New Scenario
        </button>
      </div>

      <nav
        className="flex-1 overflow-y-auto px-3 space-y-1"
        aria-label="Sidebar Tabs"
      >
        {sidebarTabs.map((tab) => {
          const isActive = activeSidebarTab === tab.id;
          const icon = getIconName(tab.id, tab.icon);

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#3e495d] text-amber-400 border-r-4 border-amber-500"
                  : "text-slate-300 hover:bg-[#3c3329] hover:text-amber-400"
              }`}
            >
              <span
                className={`material-symbols-outlined text-lg ${isActive ? "text-amber-400" : "text-slate-400"}`}
              >
                {icon}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-3 pt-4 border-t border-[#534434]/50 space-y-1">
        <button
          onClick={() => setActiveTopTab("guardrail_rules")}
          className="w-full flex items-center gap-3 px-3 py-2 rounded text-slate-400 hover:bg-[#3c3329] hover:text-white transition-all text-xs font-semibold"
        >
          <span className="material-symbols-outlined text-lg">settings</span>
          Settings
        </button>
        <button
          onClick={() =>
            alert(
              "Support: For technical or assortment assistance, contact CM support at cm-support@dollargeneral.com",
            )
          }
          className="w-full flex items-center gap-3 px-3 py-2 rounded text-slate-400 hover:bg-[#3c3329] hover:text-white transition-all text-xs font-semibold"
        >
          <span className="material-symbols-outlined text-lg">
            contact_support
          </span>
          Support
        </button>
      </div>
    </aside>
  );
}
