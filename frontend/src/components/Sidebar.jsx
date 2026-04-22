
import React from 'react';

const Sidebar = () => {
  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-slate-100 dark:bg-slate-900 flex flex-col p-6 gap-4 z-40 mt-[73px]">
      <div className="mb-6">
        <h2 className="font-manrope font-black text-blue-950 dark:text-white text-lg">CardBlock Pro</h2>
        <p className="font-inter text-xs text-slate-500">Microservice v2.4</p>
      </div>
      <nav className="flex flex-col gap-2">
        <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 transition-all duration-300 font-inter text-sm rounded-lg" href="#">
          <span className="material-symbols-outlined">dashboard</span> Overview
        </a>
        <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 transition-all duration-300 font-inter text-sm rounded-lg" href="#">
          <span className="material-symbols-outlined">security_update_good</span> Live Status
        </a>
        <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 transition-all duration-300 font-inter text-sm rounded-lg" href="#">
          <span className="material-symbols-outlined">history</span> Audit Trail
        </a>
        <a className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 text-blue-900 dark:text-blue-200 font-bold rounded-lg transition-all duration-300 font-inter text-sm shadow-sm" href="#">
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>admin_panel_settings</span> Access Control
        </a>
        <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 transition-all duration-300 font-inter text-sm rounded-lg" href="#">
          <span className="material-symbols-outlined">tune</span> Settings
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;
