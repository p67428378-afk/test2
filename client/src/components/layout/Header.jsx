import React from "react";

export default function Header({ onMenuToggle, searchQuery, setSearchQuery }) {
  return (
    <header className="h-[64px] bg-[#0F172A]/80 backdrop-blur-md border-b border-outline-variant sticky top-0 z-40 flex justify-between items-center px-6 w-full">
      {/* Mobile Menu Toggle & Brand (Hidden on Desktop) */}
      <div className="md:hidden flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="text-on-surface-variant p-2 rounded-lg hover:bg-surface-container-highest"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className="font-headline-sm text-headline-sm font-bold text-primary">
          Apex Premier
        </span>
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
            search
          </span>
          <input
            className="w-full recessed-input rounded-lg py-2 pl-10 pr-4 text-on-surface border border-outline-variant focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] font-body-sm text-body-sm transition-all outline-none placeholder:text-on-surface-variant/50"
            placeholder="Search alerts or transactions..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Trailing Actions */}
      <div className="flex items-center gap-4 ml-auto">
        <button className="relative p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-95 rounded-full hover:bg-surface-container-highest">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-background"></span>
        </button>
        <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant hidden md:block cursor-pointer">
          <img
            alt="Alexander Vance"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBr5MSTp-hqoe8vZBVw5g_NeYX_Q5sFRzmZINFFZGC8Foi-OKNsz_QiQhcRKLmFH12XgXkle1Nla-Y8ccfvxes2Nlmy6cQ9yO_oN7hVaMlkW0HQBZT5NLOfm0RGqXmtSzE5H_vCrQiOmH6dtq2XRFnHAM9qcf2yqB_gkgAAmf3PQrbnOFaFCV46FEQs1c6tSHzZwdUTm7ZMn3wyXTlycgLzOuhGwkNaBhICBYs26NfgUMJWLWjSDRSNT4vJErNUdnxKeHASlg21fg"
          />
        </div>
      </div>
    </header>
  );
}
