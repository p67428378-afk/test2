import React, { useState, useEffect } from "react";
import IdentityVerificationTable from "../components/IdentityVerificationTable";
import AppointmentApprovalsTable from "../components/AppointmentApprovalsTable";
import { listVisitors, listAppointments } from "../services/api";
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const AdminApprovalsPage = () => {
  const [activeTab, setActiveTab] = useState("verifications");
  const [stats, setStats] = useState({
    pendingVerifications: 0,
    pendingAppointments: 0,
    approvedAppointments: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [visitors, appointments] = await Promise.all([
        listVisitors(),
        listAppointments(),
      ]);
      const pendingV =
        visitors?.filter((v) => v.verification_status === "PENDING")?.length ||
        0;
      const pendingA =
        appointments?.filter((a) => a.status === "PENDING")?.length || 0;
      const approvedA =
        appointments?.filter((a) => a.status === "APPROVED")?.length || 0;

      setStats({
        pendingVerifications: pendingV,
        pendingAppointments: pendingA,
        approvedAppointments: approvedA,
      });
    } catch (err) {
      console.error("Error loading admin stats:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Admin Clearance & Appointment Approval Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Review visitor identity background checks and enforce weekly inmate
            visit quotas
          </p>
        </div>

        <button
          onClick={loadStats}
          className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm flex items-center space-x-2 self-start"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Stats</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase font-semibold text-slate-500">
              Pending Identity Checks
            </div>
            <div className="text-2xl font-black text-slate-800">
              {stats.pendingVerifications}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase font-semibold text-slate-500">
              Pending Visit Requests
            </div>
            <div className="text-2xl font-black text-slate-800">
              {stats.pendingAppointments}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase font-semibold text-slate-500">
              Approved Visits
            </div>
            <div className="text-2xl font-black text-slate-800">
              {stats.approvedAppointments}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("verifications")}
          className={`py-3 px-6 font-semibold text-sm border-b-2 transition flex items-center space-x-2 ${
            activeTab === "verifications"
              ? "border-blue-900 text-blue-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Identity Verifications Queue</span>
          {stats.pendingVerifications > 0 && (
            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-bold">
              {stats.pendingVerifications}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("approvals")}
          className={`py-3 px-6 font-semibold text-sm border-b-2 transition flex items-center space-x-2 ${
            activeTab === "approvals"
              ? "border-blue-900 text-blue-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Appointment Approval Queue</span>
          {stats.pendingAppointments > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-bold">
              {stats.pendingAppointments}
            </span>
          )}
        </button>
      </div>

      {/* Main Content Component */}
      {activeTab === "verifications" ? (
        <IdentityVerificationTable />
      ) : (
        <AppointmentApprovalsTable />
      )}
    </div>
  );
};

export default AdminApprovalsPage;
