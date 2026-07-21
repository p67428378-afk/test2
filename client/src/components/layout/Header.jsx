import React from "react";

export default function Header({ isWsConnected, user, onLogout }) {
  return (
    <header className="hidden md:flex h-[64px] fixed top-0 right-0 left-[260px] z-10 bg-surface border-b border-outline-variant justify-between items-center px-gutter w-[calc(100%-260px)]">
      <div className="flex items-center">
        <div className="relative hidden lg:block text-on-surface-variant">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px]">
            search
          </span>
          <input
            className="bg-surface-container-lowest border border-outline-variant rounded-full pl-9 pr-4 py-1.5 font-label-md text-label-md focus:outline-none focus:border-primary-fixed-dim transition-colors text-on-surface"
            placeholder="Search..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isWsConnected ? (
          <span className="text-primary font-label-md text-label-md font-bold px-3 py-1 bg-primary-fixed/10 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse"></span>{" "}
            Live Sync Connected
          </span>
        ) : (
          <span className="text-error font-label-md text-label-md font-bold px-3 py-1 bg-error-container/10 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-error"></span> Offline
          </span>
        )}

        <button className="text-on-surface-variant hover:bg-surface-container-lowest transition-colors p-2 rounded-full cursor-pointer flex items-center justify-center">
          <span className="material-symbols-outlined text-[20px]">
            notifications
          </span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant overflow-hidden">
            <img
              alt="User Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuRs975gbNiIXJEi7eAuDmyfF4K_Xuqn0OgfKoWeTx4ZKDOQAYpC2Z06_ldas_E214deg1VT9uG61_RzAqEVgw1zUchkciekvbcTQHrsK4VhT-aTAReT1O2_unL8tcaDUwYp-wPIdnMl019cgNiQyuKoNvC5sTrQ5Lu_ebXEnPgKTxqkNdhT1vD5eFCPMPUGBRTwBXcUkAVzNSMFPNsfhGG0kywAQ2dkMRlhix1wqJ24B65yJo8fBkB7HejPl8opdpGvSvVZBNRbI"
            />
          </div>
          <button
            onClick={onLogout}
            className="text-on-surface-variant hover:text-error font-label-md text-label-md px-2 py-1 rounded hover:bg-surface-container-lowest transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
