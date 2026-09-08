import React, { useState } from "react";
import { createRecurringPass } from "../services/api";
import {
  Calendar,
  Clock,
  User,
  Shield,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function RecurringPassForm({ onPassCreated }) {
  const [formData, setFormData] = useState({
    visitor_name: "",
    service_type: "Cleaner",
    days_of_week: "Mon,Wed,Fri",
    start_date: new Date().toISOString().split("T")[0] + "T00:00:00Z",
    end_date:
      new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0] + "T23:59:59Z",
    access_start_time: "09:00",
    access_end_time: "12:00",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await createRecurringPass(formData);
      setMessage(
        "Recurring pass created successfully for " + response.visitor_name,
      );
      setFormData({
        visitor_name: "",
        service_type: "Cleaner",
        days_of_week: "Mon,Wed,Fri",
        start_date: new Date().toISOString().split("T")[0] + "T00:00:00Z",
        end_date:
          new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0] + "T23:59:59Z",
        access_start_time: "09:00",
        access_end_time: "12:00",
      });
      if (onPassCreated) onPassCreated(response);
    } catch (err) {
      console.error("Error creating recurring pass:", err);
      setError(
        err?.response?.data?.detail || "Failed to create recurring pass.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        <Calendar className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-bold text-slate-900">
          Configure Recurring Visitor Pass
        </h2>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Staff / Visitor Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                placeholder="e.g. Carol Cleaner"
                value={formData.visitor_name}
                onChange={(e) =>
                  setFormData({ ...formData, visitor_name: e.target.value })
                }
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Service Type *
            </label>
            <select
              value={formData.service_type}
              onChange={(e) =>
                setFormData({ ...formData, service_type: e.target.value })
              }
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              <option value="Cleaner">House Cleaner / Maid</option>
              <option value="Maintenance">Maintenance & Repair</option>
              <option value="Tutor">Private Tutor / Instructor</option>
              <option value="Nanny">Nanny / Babysitter</option>
              <option value="Cook">Private Chef / Cook</option>
              <option value="Driver">Personal Driver</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Recurring Days *
            </label>
            <input
              type="text"
              required
              placeholder="Mon,Wed,Fri"
              value={formData.days_of_week}
              onChange={(e) =>
                setFormData({ ...formData, days_of_week: e.target.value })
              }
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
            />
            <span className="text-[10px] text-slate-400">
              Comma-separated (e.g. Mon,Wed,Fri)
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Daily Access Start *
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="time"
                required
                value={formData.access_start_time}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    access_start_time: e.target.value,
                  })
                }
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Daily Access End *
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="time"
                required
                value={formData.access_end_time}
                onChange={(e) =>
                  setFormData({ ...formData, access_end_time: e.target.value })
                }
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg text-xs transition flex items-center justify-center gap-2 shadow"
        >
          {loading ? (
            "Generating Recurring Pass..."
          ) : (
            <>
              <Shield className="w-4 h-4" /> Issue Recurring Access Pass
            </>
          )}
        </button>
      </form>
    </div>
  );
}
