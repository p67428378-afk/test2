import React from "react";
import { AlertTriangle, X, ShieldAlert } from "lucide-react";

export default function ConflictAlertModal({
  isOpen,
  onClose,
  date,
  conflictingSessions = [],
}) {
  if (!isOpen) return null;

  const defaultConflicts = [
    {
      session_id: "#104",
      start_time: "10:00 AM",
      customer_name: "Samantha Reed",
      status: "confirmed",
    },
    {
      session_id: "#108",
      start_time: "02:00 PM",
      customer_name: "David Miller",
      status: "confirmed",
    },
  ];

  const sessions =
    conflictingSessions.length > 0 ? conflictingSessions : defaultConflicts;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-amber-200">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-amber-950">
                Schedule Conflict Alert
              </h3>
              <p className="text-xs text-amber-800">
                Affected Date: {date || "Sunday, June 21"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-md hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 mb-4 leading-relaxed">
          <p className="font-bold mb-1">
            ⚠️ Confirmed Bookings Exist on Selected Date!
          </p>
          <p>
            Blocking <strong>{date || "Sunday, June 21"}</strong> directly
            conflicts with {sessions.length} active sessions. Blocking this date
            requires rescheduling or administrative override.
          </p>
        </div>

        <div className="space-y-2 mb-6">
          <p className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            Affected Sessions:
          </p>
          {sessions.map((s, idx) => (
            <div
              key={idx}
              className="p-3 bg-stone-50 border border-stone-200 rounded-lg flex justify-between items-center text-xs"
            >
              <div>
                <span className="font-bold text-stone-900">
                  {s.session_id || s.id}
                </span>
                <span className="text-stone-500 ml-2">@ {s.start_time}</span>
                <p className="text-stone-600 text-2xs font-medium">
                  {s.customer_name || "Customer"}
                </p>
              </div>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-2xs font-semibold rounded capitalize">
                {s.status}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-bold rounded-lg hover:bg-stone-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
          >
            Request Reschedule Notice
          </button>
        </div>
      </div>
    </div>
  );
}
