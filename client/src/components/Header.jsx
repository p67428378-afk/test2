import React from "react";

export default function Header({ title, user }) {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-10">
      <h2 className="text-xl font-semibold text-slate-100">{title}</h2>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-200">
              {user?.full_name}
            </p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold">
            {user?.full_name?.charAt(0) || "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
