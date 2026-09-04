import React, { useState } from "react";
import { X, Clock, CheckCircle, FileText, BookOpen } from "lucide-react";

const SessionLogModal = ({
  isOpen,
  onClose,
  topics = [],
  initialTopicId = "",
  initialTopicTitle = "",
  onSubmitLog,
}) => {
  const [topicId, setTopicId] = useState(initialTopicId);
  const [sessionMinutes, setSessionMinutes] = useState(45);
  const [notes, setNotes] = useState("");
  const [updateStatus, setUpdateStatus] = useState("Completed");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topicId && !initialTopicId) return;

    try {
      setSubmitting(true);
      await onSubmitLog({
        topic_id: topicId || initialTopicId,
        session_minutes: Number(sessionMinutes),
        notes,
        status: updateStatus,
      });
      setNotes("");
      onClose();
    } catch (err) {
      console.error("Error logging study session:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          title="Close"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-2 text-indigo-600 font-bold mb-1">
          <Clock className="h-5 w-5" />
          <span>Log Study Session</span>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          Record your time spent studying and update topic progress.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5 text-slate-500" />
              <span>Select Topic</span>
            </label>
            {initialTopicTitle ? (
              <input
                type="text"
                disabled
                value={initialTopicTitle}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium cursor-not-allowed"
              />
            ) : (
              <select
                required
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="">-- Choose a Topic --</option>
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.status || "Not Started"})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                <span>Duration (Minutes)</span>
              </label>
              <input
                type="number"
                min="5"
                step="5"
                required
                value={sessionMinutes}
                onChange={(e) => setSessionMinutes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5 text-slate-500" />
                <span>Update Status</span>
              </label>
              <select
                value={updateStatus}
                onChange={(e) => setUpdateStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Not Started">Not Started</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="h-3.5 w-3.5 text-slate-500" />
              <span>Study Notes & Observations</span>
            </label>
            <textarea
              rows="3"
              placeholder="Key formulas reviewed, chapters read, or areas needing review..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Study Log"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionLogModal;
