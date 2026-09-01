import React, { useState } from "react";
import VisitorRegistrationForm from "../components/VisitorRegistrationForm";
import AppointmentScheduler from "../components/AppointmentScheduler";
import DigitalPassView from "../components/DigitalPassView";
import { UserPlus, Calendar, QrCode, Check } from "lucide-react";

const VisitorPortalPage = () => {
  const [activeTab, setActiveTab] = useState("register");
  const [registeredVisitor, setRegisteredVisitor] = useState(null);
  const [createdAppointment, setCreatedAppointment] = useState(null);

  const handleVisitorRegistered = (visitor) => {
    setRegisteredVisitor(visitor);
    setActiveTab("schedule");
  };

  const handleAppointmentCreated = (appointment) => {
    setCreatedAppointment(appointment);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-2">
          Prison Visitor Portal & Express Digital QR Pass Request
        </h1>
        <p className="text-sm text-blue-100 max-w-2xl">
          Register visitor profiles, execute automated security watchlist
          clearance checks, and book visit appointments with digital gate pass
          issuance.
        </p>

        {/* Stepper */}
        <div className="mt-6 pt-6 border-t border-blue-800/60 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-semibold">
          <div
            className={`flex items-center space-x-2 ${activeTab === "register" ? "text-amber-300" : "text-blue-200"}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeTab === "register" ? "bg-amber-400 text-slate-950" : "bg-blue-800 text-white"}`}
            >
              1
            </div>
            <span>Profile & Watchlist Check</span>
          </div>

          <div
            className={`flex items-center space-x-2 ${activeTab === "schedule" ? "text-amber-300" : "text-blue-200"}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeTab === "schedule" ? "bg-amber-400 text-slate-950" : "bg-blue-800 text-white"}`}
            >
              2
            </div>
            <span>Slot & Quota Booking</span>
          </div>

          <div className="flex items-center space-x-2 text-blue-200">
            <div className="w-6 h-6 rounded-full bg-blue-800 text-white flex items-center justify-center text-xs font-bold">
              3
            </div>
            <span>Encrypted Pass Issuance</span>
          </div>

          <div className="flex items-center space-x-2 text-blue-200">
            <div className="w-6 h-6 rounded-full bg-blue-800 text-white flex items-center justify-center text-xs font-bold">
              4
            </div>
            <span>Gate QR Check-In</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
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
          <span>1. Visitor Registration & Screening</span>
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
          <span>2. Schedule Visit & Pass Request</span>
          {registeredVisitor && (
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full flex items-center space-x-1">
              <Check className="w-3 h-3" />
              <span>Registered</span>
            </span>
          )}
        </button>
      </div>

      {/* Main Page Layout (Grid for Schedule & Active Pass View) */}
      {activeTab === "register" ? (
        <VisitorRegistrationForm
          onVisitorRegistered={handleVisitorRegistered}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <AppointmentScheduler
              initialVisitorId={registeredVisitor?.id || ""}
              onAppointmentCreated={handleAppointmentCreated}
            />
          </div>
          <div className="lg:col-span-5">
            <DigitalPassView
              appointment={createdAppointment}
              passData={createdAppointment?.digital_pass}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorPortalPage;
