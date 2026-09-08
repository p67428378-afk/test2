import React from "react";
import { LayoutDashboard, Receipt, Plus, Wallet } from "lucide-react";

export default function TopNavBar({ activeTab, setActiveTab, onOpenAddModal }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo & Title */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setActiveTab("dashboard")}
          >
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                ExpenseTracker
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Personal Finance Manager
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-4">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "dashboard"
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab("expenses")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "expenses"
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Expenses</span>
            </button>
          </nav>

          {/* Action Button */}
          <div className="flex items-center">
            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Expense</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
