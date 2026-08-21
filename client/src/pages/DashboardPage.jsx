import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  CreditCard,
  UserPlus,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle2,
  FilePlus,
  ArrowRight,
} from "lucide-react";
import StatCard from "../components/common/StatCard";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import {
  patientService,
  appointmentService,
  billingService,
  scheduleService,
} from "../services/api";

export default function DashboardPage({ user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingInvoices: 0,
    totalDoctors: 1,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [patientsRes, appointmentsRes, invoicesRes, schedulesRes] =
        await Promise.allSettled([
          patientService.getPatients(0, 10),
          appointmentService.getAppointments(0, 10),
          billingService.getInvoices("", "PENDING", 0, 10),
          scheduleService.listSchedules(0, 10),
        ]);

      const patients =
        patientsRes.status === "fulfilled" ? patientsRes.value : [];
      const appointments =
        appointmentsRes.status === "fulfilled" ? appointmentsRes.value : [];
      const invoices =
        invoicesRes.status === "fulfilled" ? invoicesRes.value : [];

      setStats({
        totalPatients: Array.isArray(patients) ? patients.length : 0,
        todayAppointments: Array.isArray(appointments)
          ? appointments.length
          : 0,
        pendingInvoices: Array.isArray(invoices) ? invoices.length : 0,
        totalDoctors: 1,
      });

      setRecentAppointments(
        Array.isArray(appointments) ? appointments.slice(0, 5) : [],
      );
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load live metrics. Showing cached state.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome & ICU Alert Banner */}
      <div className="bg-white p-6 rounded-xl border border-[#e0e8f0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#171f2e] tracking-tight">
            Hospital Management System Dashboard
          </h1>
          <p className="text-sm text-[#6b7a8f] mt-0.5">
            Welcome back,{" "}
            <span className="font-semibold text-[#1485b8]">
              {user?.full_name || "Staff Member"}
            </span>{" "}
            ({user?.role || "Staff"})
          </p>
        </div>

        {/* ICU / Bed Warning Banner */}
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-3.5 py-2 rounded-lg text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-[#eb9414] shrink-0" />
          <span>
            <strong>ICU Notice:</strong> Bed Occupancy at 85%. 3 Emergency Beds
            Available.
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg text-xs">
          {error}
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Patients"
          value={loading ? "..." : stats.totalPatients}
          icon={Users}
          trend="+12%"
          trendLabel="from last month"
          color="primary"
        />
        <StatCard
          title="Today's Appointments"
          value={loading ? "..." : stats.todayAppointments}
          icon={Calendar}
          trend="Live Queue"
          trendLabel="active slots"
          color="success"
        />
        <StatCard
          title="Pending Invoices"
          value={loading ? "..." : stats.pendingInvoices}
          icon={CreditCard}
          trend="Action Required"
          trendLabel="unpaid bills"
          color="warning"
        />
        <StatCard
          title="Active Doctors"
          value={stats.totalDoctors}
          icon={Activity}
          trend="On Shift"
          trendLabel="Dr. John Smith"
          color="primary"
        />
      </div>

      {/* Main Split Section: Recent Appointments Queue & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live Appointment Queue */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#e0e8f0] shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#e0e8f0] pb-3">
            <h2 className="text-base font-bold text-[#171f2e] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#1485b8]" />
              <span>Live Appointment Queue</span>
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/appointments")}
              icon={ArrowRight}
            >
              View All
            </Button>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-[#6b7a8f]">
              Loading appointments...
            </div>
          ) : recentAppointments.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#6b7a8f] space-y-2">
              <p className="font-medium text-sm text-[#171f2e]">
                No appointments scheduled for today.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate("/appointments")}
                icon={Calendar}
              >
                Book New Appointment
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-[#e0e8f0]">
              {recentAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="py-3 flex items-center justify-between text-sm"
                >
                  <div>
                    <p className="font-semibold text-[#171f2e]">
                      Appointment #{apt.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-[#6b7a8f]">
                      Time: {new Date(apt.appointment_time).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={apt.status}>{apt.status}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate("/appointments")}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Quick Operational Actions */}
        <div className="bg-white rounded-xl border border-[#e0e8f0] shadow-sm p-5 space-y-4">
          <h2 className="text-base font-bold text-[#171f2e] border-b border-[#e0e8f0] pb-3">
            Quick Actions
          </h2>

          <div className="space-y-2.5">
            <button
              onClick={() => navigate("/patients")}
              className="w-full p-3 bg-slate-50 border border-[#e0e8f0] rounded-lg hover:bg-[#e8f4f8] hover:border-[#1485b8] text-left transition-all flex items-center space-x-3 group"
            >
              <div className="p-2 bg-[#1485b8] text-white rounded-md group-hover:scale-105 transition-transform">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-sm text-[#171f2e]">
                  Register Patient
                </p>
                <p className="text-xs text-[#6b7a8f]">
                  Create new profile & SSN validation
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate("/appointments")}
              className="w-full p-3 bg-slate-50 border border-[#e0e8f0] rounded-lg hover:bg-[#e8f4f8] hover:border-[#1485b8] text-left transition-all flex items-center space-x-3 group"
            >
              <div className="p-2 bg-emerald-600 text-white rounded-md group-hover:scale-105 transition-transform">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-sm text-[#171f2e]">
                  Book Appointment
                </p>
                <p className="text-xs text-[#6b7a8f]">
                  Select doctor 30-min shift slot
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate("/medical-records")}
              className="w-full p-3 bg-slate-50 border border-[#e0e8f0] rounded-lg hover:bg-[#e8f4f8] hover:border-[#1485b8] text-left transition-all flex items-center space-x-3 group"
            >
              <div className="p-2 bg-blue-600 text-white rounded-md group-hover:scale-105 transition-transform">
                <FilePlus className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-sm text-[#171f2e]">
                  Log Consultation
                </p>
                <p className="text-xs text-[#6b7a8f]">
                  Record diagnosis & prescription
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate("/invoices")}
              className="w-full p-3 bg-slate-50 border border-[#e0e8f0] rounded-lg hover:bg-[#e8f4f8] hover:border-[#1485b8] text-left transition-all flex items-center space-x-3 group"
            >
              <div className="p-2 bg-amber-600 text-white rounded-md group-hover:scale-105 transition-transform">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-sm text-[#171f2e]">
                  Billing & Invoices
                </p>
                <p className="text-xs text-[#6b7a8f]">
                  Process payments & itemized bills
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
