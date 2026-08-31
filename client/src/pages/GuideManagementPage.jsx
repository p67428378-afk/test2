import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  UserCheck,
  AlertTriangle,
  Mail,
  Award,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import {
  getGuides,
  getSchedules,
  createGuide,
  assignGuide,
} from "../services/api";

export default function GuideManagementPage() {
  const [guides, setGuides] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  // Assignment section state
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const [selectedGuideId, setSelectedGuideId] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignmentAlert, setAssignmentAlert] = useState(null);

  // Register guide modal/form state
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [newGuideName, setNewGuideName] = useState("");
  const [newGuideEmail, setNewGuideEmail] = useState("");
  const [newGuideSpec, setNewGuideSpec] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    setPageError(null);
    try {
      const [gRes, sRes] = await Promise.all([getGuides(), getSchedules()]);
      setGuides(gRes.data || []);
      setSchedules(sRes.data || []);
    } catch (err) {
      setPageError(
        "Failed to load guide and schedule information from server.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedScheduleId || !selectedGuideId) return;
    setAssignmentAlert(null);
    setIsAssigning(true);

    try {
      await assignGuide(selectedScheduleId, selectedGuideId);
      setAssignmentAlert({
        type: "success",
        text: "Guide assigned successfully to the tour schedule slot!",
      });
      await loadData();
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg =
        typeof detail === "string"
          ? detail
          : detail?.[0]?.msg ||
            "Schedule conflict: Guide is already assigned to an overlapping tour slot.";
      setAssignmentAlert({
        type: "error",
        text: msg,
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRegisterGuide = async (e) => {
    e.preventDefault();
    setRegisterError(null);
    setIsRegistering(true);

    try {
      await createGuide({
        name: newGuideName.trim(),
        email: newGuideEmail.trim(),
        specialization: newGuideSpec.trim() || null,
      });
      setShowGuideModal(false);
      setNewGuideName("");
      setNewGuideEmail("");
      setNewGuideSpec("");
      await loadData();
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg =
        typeof detail === "string"
          ? detail
          : detail?.[0]?.msg || "Failed to register guide.";
      setRegisterError(msg);
    } finally {
      setIsRegistering(false);
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    try {
      return new Date(isoString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Tour Guide Assignment & Availability Manager
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Assign qualified guides to published tours, resolve schedule
              overlaps, and track guide rosters.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={loadData}
              disabled={isLoading}
              className="px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-sm flex items-center gap-1.5"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={() => setShowGuideModal(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-sm flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register New Guide</span>
            </button>
          </div>
        </div>

        {pageError && (
          <div
            role="alert"
            className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center justify-between"
          >
            <span>{pageError}</span>
            <button onClick={loadData} className="underline font-semibold ml-4">
              Retry
            </button>
          </div>
        )}

        {/* Quick Guide Assignment Tool with Overlap Conflict Detection */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Assign Guide to Tour Slot
              </h2>
              <p className="text-xs text-slate-500">
                System validates guide availability and automatically flags
                concurrent scheduling conflicts.
              </p>
            </div>
          </div>

          {assignmentAlert && (
            <div
              role="alert"
              className={`p-4 rounded-xl border flex items-start space-x-3 text-xs ${
                assignmentAlert.type === "error"
                  ? "bg-rose-50 border-rose-200 text-rose-900"
                  : "bg-emerald-50 border-emerald-200 text-emerald-900"
              }`}
            >
              {assignmentAlert.type === "error" ? (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold block mb-0.5">
                  {assignmentAlert.type === "error"
                    ? "Assignment Conflict Detected"
                    : "Success"}
                </span>
                <span>{assignmentAlert.text}</span>
              </div>
            </div>
          )}

          <form
            onSubmit={handleAssign}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
          >
            <div className="md:col-span-5">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Tour Schedule Slot *
              </label>
              <select
                required
                value={selectedScheduleId}
                onChange={(e) => setSelectedScheduleId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
              >
                <option value="">-- Choose Schedule Slot --</option>
                {schedules.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.tour_title || "Guided Tour"} (
                    {new Date(s.start_time).toLocaleDateString()}{" "}
                    {formatTime(s.start_time)}-{formatTime(s.end_time)}){" "}
                    {s.guide_name
                      ? `[Current: ${s.guide_name}]`
                      : "[Unassigned]"}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Tour Guide *
              </label>
              <select
                required
                value={selectedGuideId}
                onChange={(e) => setSelectedGuideId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
              >
                <option value="">-- Choose Guide --</option>
                {guides.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} - {g.specialization || "General Highlights"}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={
                  isAssigning || !selectedScheduleId || !selectedGuideId
                }
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-semibold transition shadow-sm flex items-center justify-center space-x-1.5"
              >
                {isAssigning ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Checking Overlap...</span>
                  </>
                ) : (
                  <span>Confirm Assignment</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Registered Guides Roster */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Registered Tour Guides Roster
            </h3>
            <span className="text-xs text-slate-500">
              {guides.length} qualified guides active
            </span>
          </div>

          {guides.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              No tour guides registered yet. Click &quot;Register New
              Guide&quot; to add one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Guide Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Area of Specialization</th>
                    <th className="py-3 px-4">Guide ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {guides.map((g) => (
                    <tr key={g.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                          {g.name.charAt(0)}
                        </div>
                        <span>{g.name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {g.email}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium text-[11px]">
                          <Award className="w-3 h-3 text-indigo-500" />
                          {g.specialization || "General Collections"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                        {g.id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Register Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 relative">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                Register Tour Guide
              </h3>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterGuide} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alice Smith"
                  value={newGuideName}
                  onChange={(e) => setNewGuideName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. alice.smith@museum.org"
                  value={newGuideEmail}
                  onChange={(e) => setNewGuideEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specialization / Domain Expertise
                </label>
                <input
                  type="text"
                  placeholder="e.g. Renaissance Art, Ancient Egypt, Impressionism"
                  value={newGuideSpec}
                  onChange={(e) => setNewGuideSpec(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>

              {registerError && (
                <div
                  role="alert"
                  className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{registerError}</span>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGuideModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-semibold transition shadow-sm"
                >
                  {isRegistering ? "Registering..." : "Register Guide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
