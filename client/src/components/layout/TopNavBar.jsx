import React from "react";

export default function TopNavBar() {
  return (
    <header className="fixed top-0 left-0 w-full h-nav-height z-50 flex items-center justify-between px-margin-desktop bg-surface border-b border-outline-variant shadow-sm">
      <div className="flex items-center gap-4">
        <div className="bg-primary-container text-on-primary-container w-10 h-10 flex items-center justify-center font-bold text-xl rounded">
          DG
        </div>
        <h1 className="font-headline-md text-headline-md font-black text-primary">
          Cluster Assortment Advisor
        </h1>
      </div>
      <div className="hidden md:flex items-center gap-2 bg-surface-container py-1 px-3 rounded-full border border-outline-variant">
        <span className="material-symbols-outlined text-secondary text-sm">
          location_on
        </span>
        <span className="font-label-md text-label-md text-on-surface-variant">
          Cluster: Small Town Value (STV-01)
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden md:block">
          <div className="flex items-center justify-end gap-4">
            <div className="font-label-md text-label-md text-on-surface">
              Sarah Chen
            </div>
            <span className="bg-primary-container text-on-primary-container text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ml-3">
              8
            </span>
          </div>
          <div className="font-body-sm text-body-sm text-secondary">
            Category Manager - Snacks
          </div>
        </div>
        <img
          alt="User Avatar"
          className="w-10 h-10 rounded-full border border-outline-variant object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoCdYwSB3o9agX-eXeUo32_NtJ1IGwK5N7rAsJHwdL8L_IPq2_zF48Bg9gAFVestBuK5zpiiA_NUjKKVZ884YEHZdbzNjcWYEFd0lhtMcNXS8jr_dXGOOosY43fap5WvQLV33-FYIZJMyfOI_DuIKsk85OEvejlLZnee3UPqUj56ooSJhC2U149XOrTi-lwY-SxslQlQ-seVlhRObCmOHiSVflR0Mj9s1BmQtKcriVb3X-NImpomcUsaWLqXGqdwTkjNN2Tcvulpw"
        />
        <span className="material-symbols-outlined text-secondary cursor-pointer hover:text-primary transition-colors">
          settings
        </span>
      </div>
    </header>
  );
}
