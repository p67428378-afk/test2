import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { incidentService } from "../services/api";
import {
  FileText,
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Clock,
} from "lucide-react";

export default function RCAPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rca, setRca] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchRCA = async () => {
      try {
        const data = await incidentService.getRCA(id);
        setRca(data);
        setContent(data.content);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.detail ||
            "Failed to load RCA report. Ensure the incident is resolved.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchRCA();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const updated = await incidentService.saveRCA(id, content);
      setRca((prev) => ({
        ...prev,
        content: updated.content,
        updated_at: updated.updated_at,
      }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to save RCA report.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">
          Loading Root Cause Analysis (RCA) Report...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <span className="text-xs text-slate-400 font-mono">
          RCA ID: {rca?.id}
        </span>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm shadow-sm">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {rca && (
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 px-8 py-6 text-white flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-400" />
                <h3 className="text-lg font-bold">
                  Root Cause Analysis (RCA) Report
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Automatically drafted upon incident resolution. Review and
                refine the root cause details below.
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 text-sm shadow-md shadow-emerald-600/10"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "Saving..." : "Save Report"}
            </button>
          </div>

          <div className="p-8 space-y-8">
            {success && (
              <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm">
                <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>RCA report updated successfully!</span>
              </div>
            )}

            {/* Timeline Section */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-slate-400" /> Incident Timeline
              </h4>
              <div className="relative border-l-2 border-slate-200 ml-3 pl-6 space-y-4 py-2">
                {rca.timeline?.map((event, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[31px] top-1.5 bg-white border-2 border-blue-500 rounded-full h-3 w-3" />
                    <p className="text-sm text-slate-700 font-medium">
                      {event}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Editor Section */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                RCA Content & Findings
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="12"
                className="w-full p-4 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50/50"
                placeholder="Document the root cause, impact, and preventive actions..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
