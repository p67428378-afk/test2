import React, { useState } from "react";
import VisitorRegistrationForm from "../components/VisitorRegistrationForm";
import AppointmentScheduler from "../components/AppointmentScheduler";
import { UserPlus, Calendar, ShieldCheck, Check } from "lucide-react";

const VisitorPortalPage = () => {
  const [activeTab, setActiveTab] = useState("register");
  const [registeredVisitor, setRegisteredVisitor] = useState(null);

  const handleVisitorRegistered = (visitor) => {
    setRegisteredVisitor(visitor);
    setActiveTab("schedule");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-2">
          Public Visitor Registration & Scheduling Portal
        </h1>
        <p className="text-sm text-blue-100 max-w-2xl">
          Register your identity details, upload government ID verification
          documents, and book visit appointments with correctional facility
          inmates.
        </p>

        {/* 4-Step Progress Stepper */}
        <div className="mt-6 pt-6 border-t border-blue-800/60 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-semibold">
          <div
            className={`flex items-center space-x-2 ${activeTab === "register" ? "text-amber-300" : "text-blue-200"}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeTab === "register" ? "bg-amber-400 text-slate-950" : "bg-blue-800 text-white"}`}
            >
              1
            </div>
            <span>Visitor Profile</span>
          </div>

          <div className="flex items-center space-x-2 text-blue-200">
            <div className="w-6 h-6 rounded-full bg-blue-800 text-white flex items-center justify-center text-xs font-bold">
              2
            </div>
            <span>ID Upload</span>
          </div>

          <div
            className={`flex items-center space-x-2 ${activeTab === "schedule" ? "text-amber-300" : "text-blue-200"}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeTab === "schedule" ? "bg-amber-400 text-slate-950" : "bg-blue-800 text-white"}`}
            >
              3
            </div>
            <span>Slot Booking</span>
          </div>

          <div className="flex items-center space-x-2 text-blue-200">
            <div className="w-6 h-6 rounded-full bg-blue-800 text-white flex items-center justify-center text-xs font-bold">
              4
            </div>
            <span>Admin Clearance</span>
          </div>
        </div>
      </div>

      {/* Tab Controls */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("register")}
          className={`flex items-center space-x-2 py-3 px-6 font-semibold text-sm border-b-2 transition ${
            activeTab === "register"
              ? "border-blue-900 text-blue-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>1. Register Profile</span>
        </button>

        <button
          onClick={() => setActiveTab("schedule")}
          className={`flex items-center space-x-2 py-3 px-6 font-semibold text-sm border-b-2 transition ${
            activeTab === "schedule"
              ? "border-blue-900 text-blue-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>2. Schedule Visit Appointment</span>
          {registeredVisitor && (
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full flex items-center space-x-1">
              <Check className="w-3 h-3" />
              <span>Registered</span>
            </span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "register" ? (
        <VisitorRegistrationForm
          onVisitorRegistered={handleVisitorRegistered}
        />
      ) : (
        <AppointmentScheduler initialVisitorId={registeredVisitor?.id || ""} />
      )}
    </div>
  );
};

export default VisitorPortalPage;
