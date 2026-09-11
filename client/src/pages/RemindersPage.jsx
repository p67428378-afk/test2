import React, { useState, useEffect } from "react";
import ExpiryMilestoneTracker from "../components/ExpiryMilestoneTracker";
import { reminderService } from "../services/api";
import { Bell, CheckCircle2, AlertCircle } from "lucide-react";

export default function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const data = await reminderService.list();
      setReminders(data || []);
    } catch (err) {
      console.error("Failed to load reminders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleTriggerProcessing = async () => {
    setProcessing(true);
    setMessage({ type: "", text: "" });
    try {
      const result = await reminderService.process();
      setMessage({
        type: "success",
        text:
          result.message ||
          `Processed contract expiration milestones! Dispatched ${result.reminders_sent || 0} reminders.`,
      });
      fetchReminders();
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text:
          err.response?.data?.detail ||
          "Failed to trigger reminder processing.",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Bell className="w-6 h-6 text-indigo-600" /> Contract Expiry & Renewal
          Reminders
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor contract expiration milestones (90, 60, 30, and 15 days prior)
          and dispatch automated renewal digests.
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
            message.type === "error"
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "error" ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            onClick={() => setMessage({ type: "", text: "" })}
            className="font-bold underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-500">
          Loading renewal reminders...
        </div>
      ) : (
        <ExpiryMilestoneTracker
          reminders={reminders}
          onTriggerProcessing={handleTriggerProcessing}
          processing={processing}
        />
      )}
    </div>
  );
}
