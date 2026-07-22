import React from "react";

export default function HeaderBar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 bg-[#131b2e] border-b border-[#3c4a42] h-[64px]">
      <div className="flex items-center gap-4">
        <div className="text-xl font-bold text-[#dae2fd]">
          DG Cluster Assortment Advisor
        </div>
        <div className="w-px h-6 bg-[#3c4a42] mx-2"></div>
        <div className="text-xs text-[#bbcabf]">
          Small Town Value Cluster - Snacks Category
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="text-[#bbcabf] hover:bg-[#222a3d] transition-colors p-2 rounded-full flex items-center justify-center h-10 w-10">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            notifications
          </span>
        </button>
        <button className="text-[#bbcabf] hover:bg-[#222a3d] transition-colors p-2 rounded-full flex items-center justify-center h-10 w-10">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            settings
          </span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-[#3c4a42]">
          <div className="flex flex-col items-end">
            <span className="text-xs text-[#dae2fd] font-medium">Jane Doe</span>
            <span className="text-[10px] uppercase tracking-wider text-[#bbcabf]">
              Category Manager
            </span>
          </div>
          <img
            alt="Category Manager Avatar"
            className="w-10 h-10 rounded-full object-cover border border-[#3c4a42]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8Y3V0OM-KZ3fyFrLoKN3hCU1-GgDsjNl92kO5DQIeSmZ4JmiiY4zgKog08BjtDnvtn97FF_Ra0lP_9_y1oFh50saFfm_-s_OhwRBeM2vMFswjnSfZITc1MBhbgih6Qbch4oLSZkwfV_bZbwnWhF3faYRsaih2uxBy7hEDy3tfrRp0lC8lZUsTczQn5F2O3Jm35taSZniAqs7Au8LPbMNHTYcqtI7rkvyv1W91hHOToVsvB81VZUPw9whTjCgRVf9iV0xKOi74n1Vd"
          />
        </div>
      </div>
    </header>
  );
}
