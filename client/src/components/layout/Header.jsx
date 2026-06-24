import React from "react";

export default function Header() {
  return (
    <header className="h-[64px] bg-surface border-b border-outline-variant flex justify-between items-center px-6 sticky top-0 z-10">
      <div className="text-lg font-semibold text-on-surface">
        Semi-Urban & Rural Cluster Decision-Support
      </div>
      <div className="flex items-center gap-4">
        <button className="relative text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100 duration-200">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-on-error rounded-full text-[10px] flex items-center justify-center">
            2
          </span>
        </button>
        <button className="text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100 duration-200">
          <span className="material-symbols-outlined">settings</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant ml-2">
          <img
            alt="Advisor Profile"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxZOE21_SUnZ9btcN7tcskQ01J18NEPmZxjEObAry6-bLHiEBkPDeTiRWKMsHV8IlmbsKBaH0VKiTDlJeENmBTC4h9TkhC66epX1dQW2Q_fJRaWWxboaCW-VaSkRImItaIytEEWnbTlsHYFUx1Q2RqHhlvvdqsBOigG_yj6ObtY7NkZJGNpvDD5yok6NW8KQzeOq7VaKLrVz_iutyyJfBmRuJ9NR2LULkqQ_beRbWGSsTMe-_JwJ57ZNlgMVNSYvKhCVv3rU_QxPtt"
          />
        </div>
      </div>
    </header>
  );
}
