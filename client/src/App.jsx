import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  LayoutDashboard,
  History,
  UserCheck,
  Bell,
  Shield,
  User,
  ArrowRightLeft,
  Sparkles,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import LeaveBalanceWidget from "./components/LeaveBalanceWidget";
import LeaveApplicationForm from "./components/LeaveApplicationForm";
import LeaveHistoryTable from "./components/LeaveHistoryTable";
import ManagerDashboard from "./components/ManagerDashboard";
import api from "./services/api";

const SEED_USERS = {
  EMPLOYEE: {
    id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    email: "test@example.com",
    full_name: "John Doe",
    role: "EMPLOYEE",
    title: "Software Engineer",
    initials: "JD",
    manager_id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
  },
  MANAGER: {
    id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    email: "admin@example.com",
    full_name: "Jane Smith",
    role: "MANAGER",
    title: "Engineering Manager",
    initials: "JS",
    manager_id: null,
  },
};

export default function App() {
  const [currentRole, setCurrentRole] = useState("EMPLOYEE"); // EMPLOYEE or MANAGER
  const [activeTab, setActiveTab] = useState("DASHBOARD"); // DASHBOARD, HISTORY, MANAGER

  const currentUser = SEED_USERS[currentRole];

  // Employee Data States
  const [balances, setBalances] = useState([]);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState("");

  const [myRequests, setMyRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState("");

  // Fetch balances for current user
  const fetchBalances = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      setBalanceLoading(true);
      setBalanceError("");
      const data = await api.getLeaveBalances(currentUser.id, 2026);
      setBalances(data.balances || []);
    } catch (err) {
      setBalanceError(
        err.response?.data?.detail || err.message || "Failed to load balances",
      );
    } finally {
      setBalanceLoading(false);
    }
  }, [currentUser?.id]);

  // Fetch requests for current user
  const fetchMyRequests = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      setRequestsLoading(true);
      setRequestsError("");
      const data = await api.getLeaveRequests({ user_id: currentUser.id });
      setMyRequests(data.items || []);
    } catch (err) {
      setRequestsError(
        err.response?.data?.detail || err.message || "Failed to load requests",
      );
    } finally {
      setRequestsLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    fetchBalances();
    fetchMyRequests();
  }, [fetchBalances, fetchMyRequests]);

  const handleRoleSwitch = (newRole) => {
    setCurrentRole(newRole);
    if (newRole === "MANAGER") {
      setActiveTab("MANAGER");
    } else {
      setActiveTab("DASHBOARD");
    }
  };

  const handleLeaveSubmitted = () => {
    fetchBalances();
    fetchMyRequests();
  };

  const handleStatusUpdated = () => {
    fetchBalances();
    fetchMyRequests();
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col font-sans">
      {/* Test Account Notification Banner */}
      <aside
        aria-label="Demo environment notice"
        className="bg-slate-900 text-white text-xs px-6 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-slate-800"
      >
        <div className="flex items-center gap-2">
          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            Demo Mode
          </span>
          <span className="text-slate-300">
            Pre-seeded test accounts:{" "}
            <strong className="text-white font-medium">test@example.com</strong>{" "}
            (Employee) &bull;{" "}
            <strong className="text-white font-medium">
              admin@example.com
            </strong>{" "}
            (Manager)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-[11px]">Active Persona:</span>
          <button
            onClick={() =>
              handleRoleSwitch(
                currentRole === "EMPLOYEE" ? "MANAGER" : "EMPLOYEE",
              )
            }
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-700 transition"
          >
            <ArrowRightLeft className="w-3 h-3 text-blue-400" />
            Switch to{" "}
            {currentRole === "EMPLOYEE"
              ? "Manager (Jane Smith)"
              : "Employee (John Doe)"}
          </button>
        </div>
      </aside>

      {/* Main Navbar */}
      <header className="bg-white border-b border-[#E3E8F0] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Nav */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm font-bold text-base">
                  LF
                </div>
                <div>
                  <span className="font-extrabold text-lg text-blue-600 tracking-tight">
                    LeaveFlow
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 ml-1.5 uppercase">
                    HR Portal
                  </span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav
                aria-label="Main Navigation"
                className="hidden md:flex items-center gap-1"
              >
                <button
                  onClick={() => setActiveTab("DASHBOARD")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "DASHBOARD"
                      ? "bg-blue-50 text-blue-700"
                      : "text-[#707A8C] hover:text-[#171C29] hover:bg-slate-50"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard & Apply
                </button>

                <button
                  onClick={() => setActiveTab("HISTORY")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "HISTORY"
                      ? "bg-blue-50 text-blue-700"
                      : "text-[#707A8C] hover:text-[#171C29] hover:bg-slate-50"
                  }`}
                >
                  <History className="w-4 h-4" />
                  My History
                </button>

                <button
                  onClick={() => setActiveTab("MANAGER")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "MANAGER"
                      ? "bg-blue-50 text-blue-700"
                      : "text-[#707A8C] hover:text-[#171C29] hover:bg-slate-50"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Manager Approvals
                  {currentRole === "MANAGER" && (
                    <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      Team
                    </span>
                  )}
                </button>
              </nav>
            </div>

            {/* User Profile & Actions */}
            <div className="flex items-center gap-4">
              <button
                aria-label="View notifications"
                className="p-2 text-[#707A8C] hover:text-[#171C29] hover:bg-slate-100 rounded-xl transition"
              >
                <Bell className="w-5 h-5" />
              </button>

              <div className="h-6 w-px bg-slate-200"></div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                  {currentUser.initials}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-[#171C29] leading-tight flex items-center gap-1.5">
                    {currentUser.full_name}
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                      {currentUser.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#707A8C]">
                    {currentUser.title}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "DASHBOARD" && (
          <div className="space-y-8">
            {/* Greeting Header */}
            <div>
              <h1 className="text-2xl font-bold text-[#171C29]">
                Employee Leave Dashboard
              </h1>
              <p className="text-sm text-[#707A8C] mt-1">
                Welcome back, {currentUser.full_name} ({currentUser.title})
                &bull; View your 2026 remaining leave allocations and submit new
                requests.
              </p>
            </div>

            {/* Balance Stat Cards */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#171C29] uppercase tracking-wider">
                  2026 Leave Balances
                </h2>
                <button
                  onClick={fetchBalances}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  Refresh Balances
                </button>
              </div>
              <LeaveBalanceWidget
                balances={balances}
                loading={balanceLoading}
                error={balanceError}
                onRefresh={fetchBalances}
              />
            </section>

            {/* Split Grid: Application Form & Recent Requests */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7">
                <LeaveApplicationForm
                  currentUser={currentUser}
                  balances={balances}
                  onRequestSubmitted={handleLeaveSubmitted}
                />
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white border border-[#E3E8F0] p-6 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-[#171C29]">
                      Recent Leave Activity
                    </h3>
                    <button
                      onClick={() => setActiveTab("HISTORY")}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  {requestsLoading ? (
                    <div className="text-center py-6 text-xs text-[#707A8C]">
                      Loading recent activity...
                    </div>
                  ) : myRequests.length === 0 ? (
                    <div className="text-center py-8 text-xs text-[#707A8C]">
                      No leave requests submitted yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myRequests.slice(0, 4).map((req) => (
                        <div
                          key={req.id}
                          className="p-3 bg-[#F7FAFC] border border-[#E3E8F0] rounded-xl flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-bold text-[#171C29]">
                              {req.leave_type} ({req.total_days}{" "}
                              {req.total_days === 1 ? "day" : "days"})
                            </div>
                            <div className="text-[#707A8C] text-[11px] mt-0.5">
                              {req.start_date} to {req.end_date}
                            </div>
                          </div>
                          <div>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                req.status === "APPROVED"
                                  ? "bg-green-100 text-green-800"
                                  : req.status === "REJECTED"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {req.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Company Leave Policy Note */}
                <div className="bg-blue-50/60 border border-blue-200 p-5 rounded-2xl text-xs text-blue-900 space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-blue-800">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Leave Guidelines
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[#707A8C] text-[11px]">
                    <li>
                      Annual Vacation allocation is 15 business days per year.
                    </li>
                    <li>
                      Sick leave (10 days) applies to medical and health care.
                    </li>
                    <li>
                      Personal leave (5 days) covers casual and personal needs.
                    </li>
                    <li>
                      Requests are subject to manager review and approval.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "HISTORY" && (
          <div className="space-y-6">
            <LeaveHistoryTable
              requests={myRequests}
              loading={requestsLoading}
              error={requestsError}
              onRefresh={fetchMyRequests}
            />
          </div>
        )}

        {activeTab === "MANAGER" && (
          <div className="space-y-6">
            <ManagerDashboard
              currentManager={SEED_USERS.MANAGER}
              onStatusUpdated={handleStatusUpdated}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E3E8F0] py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#707A8C] gap-2">
          <div>
            &copy; {new Date().getFullYear()} LeaveFlow &bull; Employee Leave
            Management System
          </div>
          <div>FastAPI Backend + React 18 / Tailwind Frontend</div>
        </div>
      </footer>
    </div>
  );
}
