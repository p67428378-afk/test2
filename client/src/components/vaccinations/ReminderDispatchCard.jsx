import React, { useState } from "react";
import { Bell, Send, CheckCircle2, Clock } from "lucide-react";

export default function ReminderDispatchCard({
  reminders = [],
  onProcessReminders,
  petsMap = {},
}) {
  const [processing, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleProcess = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await onProcessReminders();
      setMessage(
        `Processed ${res.processed_count || 0} vaccination reminders successfully.`,
      );
    } catch (err) {
      setMessage(
        err.response?.data?.detail ||
          err.message ||
          "Failed to process reminders.",
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">
              Vaccination Reminders Engine
            </h3>
            <p className="text-xs text-slate-500">
              Evaluates upcoming/overdue vaccines and dispatches reminders
            </p>
          </div>
        </div>

        <button
          onClick={handleProcess}
          disabled={processing}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors shadow-sm shrink-0"
        >
          <Send className="h-4 w-4" />
          <span>
            {processing ? "Processing..." : "Run Automated Reminders"}
          </span>
        </button>
      </div>

      {message && (
        <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-xs font-medium border border-blue-200 flex items-center space-x-2">
          <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <div>
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Recent Reminder Logs
        </h4>
        {reminders.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            No reminders generated yet.
          </p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {reminders.map((rem) => {
              const pet = petsMap[rem.pet_id];
              return (
                <div
                  key={rem.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3.5 w-3.5 text-blue-500" />
                    <div>
                      <span className="font-semibold text-slate-800">
                        {pet ? pet.name : `Pet #${rem.pet_id.slice(0, 6)}`}
                      </span>
                      <span className="text-slate-500 ml-2">
                        Type: {rem.reminder_type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-slate-500">
                      Due: {formatDate(rem.scheduled_date)}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                        rem.status === "SENT"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {rem.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
