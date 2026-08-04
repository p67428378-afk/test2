import React from "react";
import { useAssortment } from "../context/AssortmentContext";

const HeaderBar = () => {
  const { kpiData } = useAssortment();

  return (
    <header className="h-[64px] w-full top-0 sticky bg-[#171f33] border-b border-[#534434] flex items-center justify-between px-6 z-50 flex-shrink-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl text-[#ffc174]">
            Cluster Assortment Advisor
          </span>
          <span className="text-[#d8c3ad] text-sm hidden sm:inline">
            — {kpiData.category || "Snacks"} (
            {kpiData.cluster_id || "Small Town Value Cluster"})
          </span>
        </div>
        <div className="hidden md:flex items-center h-full pt-1">
          <span className="text-[#ffc174] font-bold border-b-2 border-[#ffc174] pb-1 px-3 text-sm">
            {kpiData.cluster_id || "STV-CLUSTER-01"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex flex-col items-end text-right">
          <span className="text-xs font-semibold text-[#ffc174]">
            Small Town Value Cluster
          </span>
          <span className="text-xs text-[#d8c3ad]">Last sync: 10:42 AM</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-[#dae2fd]">
              Category Manager (USR-CM-882)
            </div>
            <div className="text-xs text-[#d8c3ad]">Updated: May 18, 2026</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#f59e0b] text-[#0F172A] font-bold flex items-center justify-center text-xs border border-[#534434]">
            CM
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
