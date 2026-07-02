import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { incidentService } from "../../services/api";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function IncidentForm({ onIncidentCreated }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    reporter_name: "",
    reporter_email: "",
    affected_system: "",
    priority: "Medium",
    description: "",
    occurred_at: new Date().toISOString().slice(0, 16),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const payload = {
        ...formData,
        occurred_at: new Date(formData.occurred_at).toISOString(),
      };
      const newIncident = await incidentService.createIncident(payload);
      setSuccess(true);
      setFormData({
        reporter_name: "",
        reporter_email: "",
        affected_system: "",
        priority: "Medium",
        description: "",
        occurred_at: new Date().toISOString().slice(0, 16),
      });
      if (onIncidentCreated) {
        onIncidentCreated(newIncident);
      }
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          "Failed to submit incident report. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden max-w-2xl mx-auto">
      <div className="bg-slate-900 px-6 py-4 text-white">
        <h3 className="text-lg font-bold">Report System Outage / Incident</h3>
        <p className="text-xs text-slate-400 mt-1">
          Please provide accurate details to trigger appropriate SLA tracking
          and escalation paths.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>
              Incident reported successfully! Redirecting to dashboard...
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Reporter Name
            </label>
            <input
              type="text"
              name="reporter_name"
              required
              value={formData.reporter_name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Reporter Email
            </label>
            <input
              type="email"
              name="reporter_email"
              required
              value={formData.reporter_email}
              onChange={handleChange}
              placeholder="john.doe@bfsi.com"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Affected System / Service
            </label>
            <input
              type="text"
              name="affected_system"
              required
              value={formData.affected_system}
              onChange={handleChange}
              placeholder="e.g. Core Banking API, Payment Gateway"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Priority Level
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white"
            >
              <option value="Low">Low (4h SLA)</option>
              <option value="Medium">Medium (2h SLA)</option>
              <option value="High">High (1h SLA - Auto Escalation)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Time of Occurrence
          </label>
          <input
            type="datetime-local"
            name="occurred_at"
            required
            value={formData.occurred_at}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Detailed Description
          </label>
          <textarea
            name="description"
            required
            rows="4"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the symptoms, error messages, and impact of the outage..."
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
          ></textarea>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-all disabled:opacity-50 text-sm shadow-lg shadow-blue-600/10"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting Report...
              </>
            ) : (
              "Submit Incident Report"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
