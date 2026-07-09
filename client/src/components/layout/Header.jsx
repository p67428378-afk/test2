import React from "react";

export default function Header() {
  return (
    <header className="bg-dg-black text-white border-b-4 border-dg-yellow shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-dg-yellow text-dg-black font-black px-3 py-1.5 rounded text-lg tracking-tighter shadow-sm">
            DG
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              Cluster Assortment Advisor
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              Dollar General Assortment Optimization Engine
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-400">Active Cluster</p>
            <p className="text-sm font-semibold text-dg-yellow">
              Small Town Value Cluster
            </p>
          </div>
          <div className="h-8 w-px bg-gray-700 hidden sm:block"></div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-dg-yellow text-dg-black flex items-center justify-center font-bold text-sm shadow-sm">
              JD
            </div>
            <span className="text-sm font-medium text-gray-200 hidden md:inline">
              John Doe
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
