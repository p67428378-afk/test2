import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import GuidedPracticePlayer from "../components/GuidedPracticePlayer";
import PracticeHistoryPanel from "../components/PracticeHistoryPanel";
import { routineService } from "../services/api";

export default function MyRoutinesPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState(
    location.pathname === "/practice-history" ? "history" : "routines",
  );

  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [activeRoutineForPlayer, setActiveRoutineForPlayer] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);

  const fetchRoutines = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await routineService.getRoutines();
      setRoutines(data || []);
    } catch (err) {
      setError("Failed to fetch custom routines.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, []);

  const handleDuplicate = async (id, e) => {
    e.stopPropagation();
    try {
      await routineService.duplicateRoutine(id);
      fetchRoutines();
    } catch (err) {
      alert("Failed to duplicate routine.");
    }
  };

  const handleExportPDF = async (routine, e) => {
    e.stopPropagation();
    try {
      const blob = await routineService.exportRoutine(routine.id, "pdf");
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${routine.name.replace(/\s+/g, "_")}_guide.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to export PDF guide.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      setDeleting(true);
      await routineService.deleteRoutine(deleteTargetId);
      setRoutines((prev) => prev.filter((r) => r.id !== deleteTargetId));
      setDeleteTargetId(null);
    } catch (err) {
      alert("Failed to delete routine.");
    } finally {
      setDeleting(false);
    }
  };

  const formatTotalTime = (totalSecs) => {
    const mins = Math.floor((totalSecs || 0) / 60);
    const secs = (totalSecs || 0) % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="max-w-6xl mx-auto p-6 space-y-6 flex-1 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif text-teal-950">
              My Custom Yoga Routines & Practice Logs
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage saved sequences, export cheat-sheets, duplicate flows, and
              review session stats.
            </p>
          </div>
          <Link
            to="/routines/new"
            className="bg-teal-800 hover:bg-teal-900 text-white font-medium px-5 py-2.5 rounded-xl shadow-sm text-sm"
          >
            + Create New Routine
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("routines")}
            className={`px-4 py-2 text-sm font-bold transition-all ${
              activeTab === "routines"
                ? "text-teal-900 border-b-2 border-teal-800"
                : "text-slate-600 hover:text-teal-800"
            }`}
          >
            Saved Routines ({routines.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 text-sm font-bold transition-all ${
              activeTab === "history"
                ? "text-teal-900 border-b-2 border-teal-800"
                : "text-slate-600 hover:text-teal-800"
            }`}
          >
            📊 Practice History & Logs
          </button>
        </div>

        {/* Content */}
        {activeTab === "history" ? (
          <PracticeHistoryPanel />
        ) : (
          <section className="space-y-4">
            {loading ? (
              <div className="p-12 text-center text-slate-500 font-medium">
                Loading saved routines...
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm">
                {error}
              </div>
            ) : routines.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
                <span className="text-4xl" role="img" aria-label="flow">
                  🧘‍♀️
                </span>
                <h3 className="text-xl font-bold text-slate-800">
                  No Custom Routines Saved
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Build your first personalized yoga routine with hold
                  durations, transition notes, and guided practice player
                  controls.
                </p>
                <Link
                  to="/routines/new"
                  className="inline-block px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-sm font-semibold shadow-sm"
                >
                  Build First Routine
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {routines.map((routine) => (
                  <div
                    key={routine.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold font-serif text-teal-950">
                          {routine.name}
                        </h3>
                        <span className="text-xs font-mono font-bold bg-teal-50 text-teal-800 px-2.5 py-1 rounded-full border border-teal-200">
                          {formatTotalTime(routine.total_duration_seconds)} •{" "}
                          {routine.poses?.length || 0} Poses
                        </span>
                      </div>
                      {routine.description && (
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {routine.description}
                        </p>
                      )}

                      {/* Pose Pills Preview */}
                      {routine.poses && routine.poses.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {routine.poses.slice(0, 5).map((p, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium"
                            >
                              {p.pose?.english_name || "Pose"} (
                              {p.hold_duration_seconds}s)
                            </span>
                          ))}
                          {routine.poses.length > 5 && (
                            <span className="text-[11px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
                              +{routine.poses.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2 justify-between items-center text-xs">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            setActiveRoutineForPlayer(routine);
                            setShowPlayer(true);
                          }}
                          className="bg-teal-800 hover:bg-teal-900 text-white font-bold px-3.5 py-2 rounded-lg shadow-2xs"
                        >
                          ▶ Start Flow
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/routines/edit/${routine.id}`)
                          }
                          className="border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium px-3 py-2 rounded-lg"
                        >
                          ✏ Edit
                        </button>
                      </div>

                      <div className="flex gap-1.5">
                        <button
                          onClick={(e) => handleDuplicate(routine.id, e)}
                          className="border border-slate-200 text-slate-600 hover:bg-slate-50 px-2.5 py-2 rounded-lg"
                          title="Duplicate Routine"
                        >
                          📋 Duplicate
                        </button>
                        <button
                          onClick={(e) => handleExportPDF(routine, e)}
                          className="border border-slate-200 text-slate-600 hover:bg-slate-50 px-2.5 py-2 rounded-lg"
                          title="Export PDF Guide"
                        >
                          📄 PDF
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(routine.id)}
                          className="text-red-600 hover:text-red-800 font-bold p-2"
                          title="Delete Routine"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Explicit Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold font-serif text-slate-900">
              Confirm Delete Routine
            </h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to delete this custom routine? This action
              requires explicit confirmation and cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 border rounded-lg text-slate-600 text-xs font-medium hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guided Practice Player Modal */}
      {showPlayer && activeRoutineForPlayer && (
        <GuidedPracticePlayer
          routine={activeRoutineForPlayer}
          onClose={() => setShowPlayer(false)}
          onFinish={() => {
            setShowPlayer(false);
            setActiveTab("history");
          }}
        />
      )}
    </div>
  );
}
