import React, { useState, useEffect } from "react";
import { ReviewQueueList } from "../components/review/ReviewQueueList.jsx";
import { ExpertDecisionPanel } from "../components/review/ExpertDecisionPanel.jsx";
import { reviewService, noteService } from "../services/api.js";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileText,
  Tag as TagIcon,
  Link2,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

export function ReviewQueuePage() {
  const [queue, setQueue] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");
  const [reviewsHistory, setReviewsHistory] = useState([]);

  useEffect(() => {
    fetchQueue();
  }, []);

  useEffect(() => {
    if (selectedNote?.id) {
      fetchNoteReviews(selectedNote.id);
    }
  }, [selectedNote]);

  const fetchQueue = async () => {
    setIsLoading(true);
    try {
      const data = await reviewService.getQueue();
      if (Array.isArray(data)) {
        setQueue(data);
        if (data.length > 0) {
          setSelectedNote(data[0]);
        } else {
          setSelectedNote(null);
        }
      }
    } catch (err) {
      setQueue([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNoteReviews = async (noteId) => {
    try {
      const history = await reviewService.getNoteReviews(noteId);
      if (Array.isArray(history)) {
        setReviewsHistory(history);
      }
    } catch (e) {
      setReviewsHistory([]);
    }
  };

  const handleApprove = async (noteId, reviewData) => {
    setIsSubmitting(true);
    setActionSuccess("");
    try {
      await noteService.approveNote(noteId, reviewData);
      setActionSuccess(
        "Note approved successfully and published to Knowledge Base!",
      );
      setTimeout(() => {
        setActionSuccess("");
        fetchQueue();
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (noteId, reviewData) => {
    setIsSubmitting(true);
    setActionSuccess("");
    try {
      await noteService.rejectNote(noteId, reviewData);
      setActionSuccess("Note rejected with SME feedback recorded.");
      setTimeout(() => {
        setActionSuccess("");
        fetchQueue();
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30 mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Subject Matter Expert (SME) Workstation</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Expert Validation Dashboard
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Review pending research note submissions, verify citations, and
            approve or reject notes with mandatory SME feedback.
          </p>
        </div>

        <button
          onClick={fetchQueue}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center space-x-1.5 transition border border-slate-700"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
          />
          <span>Refresh Queue</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2 shadow-sm">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <ReviewQueueList
            queue={queue}
            selectedNoteId={selectedNote?.id}
            onSelectNote={setSelectedNote}
            isLoading={isLoading}
          />
        </div>

        <div className="lg:col-span-8 space-y-6">
          {selectedNote ? (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Pending SME Validation</span>
                  </span>

                  <span className="text-xs text-slate-400 font-medium">
                    Category:{" "}
                    <strong className="text-slate-700">
                      {selectedNote.category || "General"}
                    </strong>
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">
                    {selectedNote.title}
                  </h2>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 prose prose-slate max-w-none text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap min-h-[150px]">
                    {selectedNote.body}
                  </div>
                </div>

                {selectedNote.tags && selectedNote.tags.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate-500 mb-1.5 flex items-center space-x-1">
                      <TagIcon className="h-3.5 w-3.5" />
                      <span>Submitted Tags:</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNote.tags.map((t) => {
                        const name = typeof t === "string" ? t : t.name;
                        return (
                          <span
                            key={name}
                            className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-full border border-emerald-200"
                          >
                            #{name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedNote.citations &&
                  selectedNote.citations.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-slate-500 mb-1.5 flex items-center space-x-1">
                        <Link2 className="h-3.5 w-3.5" />
                        <span>
                          Attached Citations ({selectedNote.citations.length}):
                        </span>
                      </p>
                      <div className="space-y-1">
                        {selectedNote.citations.map((c, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200 text-xs"
                          >
                            <span className="font-medium text-slate-800 truncate">
                              {c.title}
                            </span>
                            <a
                              href={c.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-600 hover:underline text-[11px] flex items-center space-x-1 ml-2"
                            >
                              <span className="truncate max-w-[200px]">
                                {c.url}
                              </span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {reviewsHistory.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <p className="text-xs font-bold text-slate-500">
                      Prior Review Audit Log:
                    </p>
                    {reviewsHistory.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-2.5 bg-slate-50 rounded border border-slate-200 text-xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`font-bold ${rev.action === "APPROVE" ? "text-emerald-600" : "text-red-600"}`}
                          >
                            {rev.action}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(rev.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-600 italic">
                          "{rev.feedback || "No feedback"}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <ExpertDecisionPanel
                note={selectedNote}
                onApprove={handleApprove}
                onReject={handleReject}
                isSubmitting={isSubmitting}
              />
            </>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 space-y-2">
              <FileText className="h-10 w-10 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">
                No Note Selected
              </p>
              <p className="text-xs">
                Select a note from the left queue to view details and render SME
                decision.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewQueuePage;
