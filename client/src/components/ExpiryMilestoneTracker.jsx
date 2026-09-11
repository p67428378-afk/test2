import React from "react";
import {
  Calendar,
  Bell,
  Mail,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function ExpiryMilestoneTracker({
  reminders = [],
  onTriggerProcessing,
  processing,
}) {
  const count90 = reminders.filter((r) => r.reminder_stage_days === 90).length;
  const count60 = reminders.filter((r) => r.reminder_stage_days === 60).length;
  const count30 = reminders.filter((r) => r.reminder_stage_days === 30).length;
  const count15 = reminders.filter((r) => r.reminder_stage_days === 15).length;

  return (
    <div className="space-y-6">
      {/* Milestone Interval KPI Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-500 font-semibold uppercase">
              In 90 Days
            </p>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {count90} Reminders
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            90-day milestone digest
          </p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-500 font-semibold uppercase">
              In 60 Days
            </p>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {count60} Reminders
          </p>
          <p className="text-[11px] text-blue-600 font-medium mt-1">
            First renewal alert
          </p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-500 font-semibold uppercase">
              In 30 Days
            </p>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">
            {count30} Reminders
          </p>
          <p className="text-[11px] text-amber-600 font-medium mt-1">
            Urgent review required
          </p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-500 font-semibold uppercase">
              In 15 Days
            </p>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-rose-600 mt-2">
            {count15} Reminders
          </p>
          <p className="text-[11px] text-rose-600 font-medium mt-1">
            Critical escalation
          </p>
        </div>
      </div>

      {/* Control Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            Automated Renewal Reminders Service
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Evaluates all active contracts against 90, 60, 30, and 15-day
            expiration thresholds and dispatches email/in-app digests.
          </p>
        </div>

        <button
          onClick={onTriggerProcessing}
          disabled={processing}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg shadow-sm flex items-center gap-2 shrink-0 disabled:opacity-50"
        >
          <Mail className="w-4 h-4" />
          {processing ? "Processing Expirations..." : "Process Reminders Now"}
        </button>
      </div>

      {/* Sent Reminders Audit Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600">
            Dispatched Renewal Reminders Audit Log
          </h4>
          <span className="text-xs font-semibold text-slate-500">
            {reminders.length} total dispatches
          </span>
        </div>

        {reminders.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No reminder logs recorded yet. Click 'Process Reminders Now' to
            evaluate active contract dates.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                  <th className="px-6 py-3">Contract Title</th>
                  <th className="px-6 py-3">Milestone Interval</th>
                  <th className="px-6 py-3">Recipient</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Dispatched At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {reminders.map((rem) => (
                  <tr key={rem.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-semibold text-slate-900">
                      {rem.contract_title || rem.contract_id}
                    </td>
                    <td className="px-6 py-3">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded font-mono font-semibold">
                        {rem.reminder_stage_days} Days Prior
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-700">
                      {rem.recipient_email}
                    </td>
                    <td className="px-6 py-3">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-semibold text-[10px] flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3 h-3" /> {rem.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-500">
                      {new Date(rem.sent_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
