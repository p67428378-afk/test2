import React from 'react';

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-full z-40 flex flex-col h-screen w-64 border-r-0 bg-slate-50 dark:bg-slate-900 font-['Manrope'] font-bold tracking-tight">
      <div className="p-8">
        <h1 className="text-xl font-bold text-[#003345] dark:text-[#004B63]">The Architectural Trust</h1>
        <p className="text-xs uppercase tracking-widest text-secondary mt-1 opacity-70">Elite Banking Division</p>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 opacity-60 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors rounded-lg" href="#">
          <span className="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </a>
        <a className="flex items-center gap-3 px-4 py-3 text-[#003345] dark:text-[#004B63] font-bold border-r-4 border-[#003345] bg-slate-100 dark:bg-slate-800 transition-all duration-400 active:scale-[0.98]" href="#">
          <span className="material-symbols-outlined">credit_card</span>
          <span>Cards</span>
        </a>
        <a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 opacity-60 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors rounded-lg" href="#">
          <span className="material-symbols-outlined">description</span>
          <span>Applications</span>
        </a>
        <a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 opacity-60 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors rounded-lg" href="#">
          <span className="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </a>
        <a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 opacity-60 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors rounded-lg" href="#">
          <span className="material-symbols-outlined">help_outline</span>
          <span>Support</span>
        </a>
      </nav>
      <div className="p-6 mt-auto">
        <button className="w-full py-3 bg-primary text-on-primary rounded-md font-semibold text-sm transition-transform active:scale-95 shadow-lg shadow-primary/10">
          Contact Advisor
        </button>
        <div className="mt-6 flex items-center gap-3">
          <img alt="User profile avatar" className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCV22Awmgpmhg18jIi3LUuJ7vZsNMqgNfNOx6BBOuO5o_ypClizR5z49XdLSjA8obxOLFRHq4CBUqOzrNqR2Ptt-tOfeE9QA1GZ8MxOdjZB4kQva9Dj8BQXgFUbUWB_2NbNAMqW3pHsB0Z0w0bIC8U7WagtxFExonGn_90GgQlY0dulb88-FHAqbFFjc5j97W2DW0BuDGDT13ByqBUoWHMcoYFyt3Y5k7SO-G-pOVhCfZapZx1essc62EZBhkOoKQO8QtLhbQlqicYr" />
          <div>
            <p className="text-sm font-bold text-primary">Julian Vance</p>
            <p className="text-[10px] text-secondary">Private Client</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
