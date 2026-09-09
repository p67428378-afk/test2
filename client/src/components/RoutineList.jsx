import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getRoutines, duplicateRoutine, deleteRoutine } from "../api/client";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import {
  Plus,
  Play,
  Edit3,
  Copy,
  Trash2,
  Clock,
  Sparkles,
  BookmarkCheck,
  PlayCircle,
  CheckCircle2,
  ChevronRight,
  X,
} from "lucide-react";

export default function RoutineList() {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete modal state
  const [routineToDelete, setRoutineToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Active Flow Player Modal state
  const [activeFlow, setActiveFlow] = useState(null);
  const [flowPoseIndex, setFlowPoseIndex] = useState(0);

  const navigate = useNavigate();

  const fetchRoutines = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRoutines();
      setRoutines(data || []);
    } catch (err) {
      console.error("Error fetching routines:", err);
      setError("Failed to load your saved routines.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, []);

  const handleDuplicate = async (routineId) => {
    try {
      await duplicateRoutine(routineId);
      fetchRoutines();
    } catch (err) {
      console.error("Failed to duplicate routine:", err);
      alert("Failed to duplicate routine.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!routineToDelete) return;
    setDeleting(true);
    try {
      await deleteRoutine(routineToDelete.id);
      setRoutineToDelete(null);
      fetchRoutines();
    } catch (err) {
      console.error("Failed to delete routine:", err);
      alert("Failed to delete routine.");
    } finally {
      setDeleting(false);
    }
  };

  const startFlowPractice = (routine) => {
    setActiveFlow(routine);
    setFlowPoseIndex(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-teal-100 text-teal-800 text-xs px-2.5 py-0.5 rounded-full font-semibold mb-2">
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Saved Flows</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-teal-950">
            My Custom Yoga Routines
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Manage, duplicate, edit, or practice your saved yoga sequences.
          </p>
        </div>

        <Link
          to="/routines/new"
          className="bg-teal-800 hover:bg-teal-900 text-white font-medium text-sm px-5 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Routine</span>
        </Link>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal-800 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-slate-600">
            Loading custom routines...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl text-center space-y-3">
          <p className="font-medium text-sm">{error}</p>
          <button
            onClick={fetchRoutines}
            className="bg-rose-700 text-white text-xs px-4 py-2 rounded-lg font-semibold hover:bg-rose-800"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && routines.length === 0 && (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center max-w-lg mx-auto space-y-4 shadow-sm">
          <div className="w-14 h-14 bg-teal-50 text-teal-800 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-serif font-bold text-slate-800">
            No Custom Routines Yet
          </h3>
          <p className="text-sm text-slate-500">
            Build your first custom yoga flow sequence by picking poses,
            specifying hold times, and adding transition notes.
          </p>
          <div className="pt-2">
            <Link
              to="/routines/new"
              className="inline-flex items-center gap-2 bg-teal-800 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-teal-900 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Build Your First Routine</span>
            </Link>
          </div>
        </div>
      )}

      {/* Routines Grid */}
      {!loading && !error && routines.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {routines.map((routine) => {
            const totalSecs = routine.total_duration_seconds || 0;
            const totalMins = Math.ceil(totalSecs / 60);
            const poseCount = routine.items ? routine.items.length : 0;

            return (
              <div
                key={routine.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-serif font-bold text-xl text-slate-900">
                        {routine.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                          <Clock className="w-3 h-3" />
                          {totalMins} min ({totalSecs}s)
                        </span>
                        <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                          {poseCount} Poses
                        </span>
                      </div>
                    </div>
                  </div>

                  {routine.description && (
                    <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                      {routine.description}
                    </p>
                  )}

                  {/* Pose Sequence Preview */}
                  {routine.items && routine.items.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                        Sequence Preview
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {routine.items.slice(0, 4).map((item, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-medium"
                          >
                            {idx + 1}.{" "}
                            {item.pose?.english_name || `Pose #${idx + 1}`} (
                            {item.hold_duration_seconds}s)
                          </span>
                        ))}
                        {routine.items.length > 4 && (
                          <span className="text-xs text-slate-400 px-2 py-1">
                            +{routine.items.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Flow Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 mt-auto">
                  <button
                    onClick={() => startFlowPractice(routine)}
                    className="bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Flow</span>
                  </button>

                  <button
                    onClick={() => navigate(`/routines/edit/${routine.id}`)}
                    className="border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition-colors flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDuplicate(routine.id)}
                    className="border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition-colors flex items-center gap-1"
                    title="Duplicate routine"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Duplicate</span>
                  </button>

                  <button
                    onClick={() => setRoutineToDelete(routine)}
                    className="border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold px-3 py-2 rounded-xl transition-colors flex items-center gap-1 ml-auto"
                    title="Delete routine"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {routineToDelete && (
        <DeleteConfirmationModal
          routineTitle={routineToDelete.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setRoutineToDelete(null)}
          deleting={deleting}
        />
      )}

      {/* Flow Practice Runner Modal */}
      {activeFlow && activeFlow.items && activeFlow.items.length > 0 && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 space-y-6 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setActiveFlow(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center space-y-1">
              <span className="bg-teal-100 text-teal-900 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                Pose {flowPoseIndex + 1} of {activeFlow.items.length}
              </span>
              <h2 className="text-2xl font-serif font-bold text-slate-900">
                {activeFlow.items[flowPoseIndex]?.pose?.english_name ||
                  "Yoga Pose"}
              </h2>
              <p className="text-sm italic text-teal-700 font-serif">
                {activeFlow.items[flowPoseIndex]?.pose?.sanskrit_name}
              </p>
            </div>

            <div className="bg-teal-900 text-white rounded-2xl p-6 text-center space-y-2">
              <span className="text-xs text-teal-300 font-semibold uppercase tracking-wider block">
                Hold Duration
              </span>
              <div className="text-4xl font-bold font-mono">
                {activeFlow.items[flowPoseIndex]?.hold_duration_seconds} sec
              </div>
            </div>

            {activeFlow.items[flowPoseIndex]?.transition_notes && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs p-3.5 rounded-xl">
                <span className="font-bold block mb-0.5">Transition Cue:</span>
                <p>{activeFlow.items[flowPoseIndex].transition_notes}</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setFlowPoseIndex(Math.max(0, flowPoseIndex - 1))}
                disabled={flowPoseIndex === 0}
                className="px-4 py-2 border rounded-xl text-sm font-medium text-slate-600 disabled:opacity-30"
              >
                Previous
              </button>

              {flowPoseIndex < activeFlow.items.length - 1 ? (
                <button
                  onClick={() => setFlowPoseIndex(flowPoseIndex + 1)}
                  className="bg-teal-800 hover:bg-teal-900 text-white text-sm font-medium px-6 py-2 rounded-xl flex items-center gap-1"
                >
                  <span>Next Pose</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setActiveFlow(null)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium px-6 py-2 rounded-xl flex items-center gap-1"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete Flow</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
