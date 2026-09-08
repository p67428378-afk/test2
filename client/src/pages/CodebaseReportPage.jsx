import React from "react";
import { Link } from "react-router-dom";
import CodebaseReportDashboard from "../components/CodebaseReportDashboard";

export default function CodebaseReportPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Top Navigation */}
      <nav className="bg-slate-950/80 border-b border-slate-800 px-6 py-4 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="flex items-center space-x-2 text-white font-bold text-lg hover:opacity-90 transition"
            >
              <span>✈️</span>
              <span className="text-blue-400 font-extrabold">TravelAI</span>
              <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded ml-2 border border-slate-700">
                Admin Console
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4 text-sm font-medium">
            <Link to="/" className="text-slate-400 hover:text-white transition">
              Plan Trip
            </Link>
            <Link
              to="/admin/codebase-report"
              className="text-indigo-400 font-semibold border-b-2 border-indigo-500 pb-0.5"
            >
              Codebase Report
            </Link>
          </div>
        </div>
      </nav>

      <CodebaseReportDashboard
        issueKey="SCRUM-231"
        repoUrl="https://github.com/p67428378-afk/test2"
        branchName="staging/ISSUE-SCRUM-231"
      />
    </div>
  );
}
