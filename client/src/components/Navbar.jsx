import React from "react";
import {
  Mail,
  Sparkles,
  Inbox,
  LayoutDashboard,
  CheckCircle2,
} from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, totalCount = 0 }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">
                  EmailClassify
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  <Sparkles className="w-3 h-3 mr-1 text-indigo-500" /> AI v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Intelligent Multi-Category Classification Engine
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              type="button"
              onClick={() => setActiveTab("studio")}
              className={`inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "studio"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Inbox className="w-4 h-4 mr-1.5" />
              Classify Studio
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("dashboard")}
              className={`inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                activeTab === "dashboard"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 mr-1.5" />
              Review Dashboard
              {totalCount > 0 && (
                <span
                  className={`ml-2 px-1.5 py-0.5 text-xs rounded-full font-bold ${
                    activeTab === "dashboard"
                      ? "bg-indigo-800 text-indigo-100"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {totalCount}
                </span>
              )}
            </button>
          </nav>

          {/* AI Status Indicator */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Classifier Ready</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
