import React, { useState } from "react";
import { revokeRecurringPass } from "../services/api";
import {
  ShieldAlert,
  Trash2,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function RecurringPassTable({ passes = [], onRefresh }) {
  const [revokingId, setRevokingId] = useState(null);

  const handleRevoke = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to revoke this recurring pass? All associated QR tokens will be invalidated immediately across guard terminals.",
      )
    ) {
      return;
    }
    setRevokingId(id);
    try {
      await revokeRecurringPass(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to revoke recurring pass:", err);
      alert(err?.response?.data?.detail || "Failed to revoke recurring pass.");
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        <Calendar className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-bold text-slate-900">
          Active Recurring Service Staff Passes
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <th className="py-2.5 px-3">Visitor Name</th>
              <th className="py-2.5 px-3">Service Type</th>
              <th className="py-2.5 px-3">Days of Week</th>
              <th className="py-2.5 px-3">Daily Hours</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {passes.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-6 text-center text-slate-400">
                  No active recurring passes configured.
                </td>
              </tr>
            ) : (
              passes.map((pass) => (
                <tr key={pass.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {pass.visitor_name}
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">
                    {pass.service_type}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-blue-700 bg-blue-50/50 rounded">
                    {pass.days_of_week}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                    {pass.access_start_time} - {pass.access_end_time}
                  </td>
                  <td className="py-3 px-3">
                    {pass.is_active ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> ACTIVE
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                        <XCircle className="w-3 h-3" /> REVOKED
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {pass.is_active && (
                      <button
                        onClick={() => handleRevoke(pass.id)}
                        disabled={revokingId === pass.id}
                        className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold py-1 px-2.5 rounded transition flex items-center gap-1 ml-auto"
                      >
                        <Trash2 className="w-3 h-3" />
                        {revokingId === pass.id ? "Revoking..." : "Revoke Pass"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
