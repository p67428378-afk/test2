import React, { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  FileText,
  CreditCard,
  Activity,
  ArrowUpRight,
  Plus,
  UserPlus,
  Clock,
} from "lucide-react";
import { getPatients, getAppointments, getInvoices } from "../services/api";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    patientsCount: 0,
    appointmentsCount: 0,
    pendingInvoicesCount: 0,
    totalRevenue: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [patients, appointments, invoices] = await Promise.all([
          getPatients({ limit: 100 }),
          getAppointments({ limit: 10 }),
          getInvoices({ limit: 100 }),
        ]);

        const pList = Array.isArray(patients) ? patients : [];
        const aList = Array.isArray(appointments) ? appointments : [];
        const iList = Array.isArray(invoices) ? invoices : [];

        const pendingInv = iList.filter(
          (inv) => inv.payment_status === "Pending",
        );
        const rev = iList
          .filter((inv) => inv.payment_status === "Paid")
          .reduce((sum, inv) => sum + (Number(inv.total_amount) || 0), 0);

        setStats({
          patientsCount: pList.length,
          appointmentsCount: aList.length,
          pendingInvoicesCount: pendingInv.length,
          totalRevenue: rev,
        });

        setRecentAppointments(aList.slice(0, 5));
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const statCards = [
    {
      name: "Total Patients",
      value: stats.patientsCount,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      name: "Scheduled Appointments",
      value: stats.appointmentsCount,
      icon: Calendar,
      color: "bg-indigo-500",
    },
    {
      name: "Pending Invoices",
      value: stats.pendingInvoicesCount,
      icon: Clock,
      color: "bg-amber-500",
    },
    {
      name: "Total Revenue Paid",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: CreditCard,
      color: "bg-emerald-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Hospital Operational Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time stats, appointment flow, and operational summary
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/patients"
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <UserPlus className="h-4 w-4" />
            <span>New Patient</span>
          </Link>
          <Link
            to="/appointments"
            className="px-3.5 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Calendar className="h-4 w-4 text-indigo-600" />
            <span>Book Slot</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center gap-4"
            >
              <div
                className={`p-3 text-white rounded-xl ${card.color} shadow-sm`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">
                  {card.name}
                </p>
                <h3 className="text-xl font-bold text-slate-800 mt-0.5">
                  {loading ? "..." : card.value}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Appointments & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800">
              Recent Appointments Schedule
            </h2>
            <Link
              to="/appointments"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Loading appointments...
            </div>
          ) : recentAppointments.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No appointments scheduled today.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentAppointments.map((app) => (
                <div
                  key={app.id}
                  className="py-3 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-800">
                      Appointment ID: {app.id.slice(0, 8)}...
                    </div>
                    <div className="text-slate-500">
                      Patient: {app.patient_id.slice(0, 8)}... | Doctor:{" "}
                      {app.doctor_id.slice(0, 8)}...
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      app.status === "Scheduled"
                        ? "bg-blue-100 text-blue-700"
                        : app.status === "In-Progress"
                          ? "bg-amber-100 text-amber-700"
                          : app.status === "Completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Module Navigation Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
            Quick Operational Access
          </h2>

          <div className="space-y-2">
            <Link
              to="/patients"
              className="flex items-center justify-between p-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-indigo-600" />
                <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-700">
                  Patient Directory
                </span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600" />
            </Link>

            <Link
              to="/appointments"
              className="flex items-center justify-between p-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-indigo-600" />
                <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-700">
                  Scheduling & Slots
                </span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600" />
            </Link>

            <Link
              to="/emr"
              className="flex items-center justify-between p-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-indigo-600" />
                <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-700">
                  EMR & Clinical Notes
                </span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600" />
            </Link>

            <Link
              to="/billing"
              className="flex items-center justify-between p-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-indigo-600" />
                <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-700">
                  Billing & Invoices
                </span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
