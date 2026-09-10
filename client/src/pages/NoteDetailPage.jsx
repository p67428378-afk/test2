import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { noteService, reviewService } from "../services/api.js";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
  Tag as TagIcon,
  Link2,
  ExternalLink,
  FileText,
  User,
  Calendar,
  ShieldCheck,
  Share2,
} from "lucide-react";

export function NoteDetailPage() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchNoteDetail();
  }, [id]);

  const fetchNoteDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await noteService.getNoteById(id);
      setNote(data);

      try {
        const revData = await reviewService.getNoteReviews(id);
        if (Array.isArray(revData)) {
          setReviews(revData);
        }
      } catch (e) {
        // Reviews fetching optional
      }
    } catch (err) {
      setError(err?.response?.data?.detail || "Research note not found.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Approved & Published</span>
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
            <XCircle className="h-4 w-4 text-red-600" />
            <span>Rejected by SME</span>
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="h-4 w-4 text-amber-600" />
            <span>Pending Review</span>
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center text-slate-500 text-sm">
        Loading research note detail...
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-4">
        <XCircle className="h-10 w-10 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">
          {error || "Note Not Found"}
        </h2>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Knowledge Base</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Knowledge Base</span>
        </Link>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 shadow-sm transition"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span>{copied ? "Link Copied!" : "Share Note"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <main className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="space-y-3 border-b border-slate-100 pb-6">
            <div className="flex items-center space-x-3 flex-wrap gap-y-2">
              <span className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-md">
                {note.category || "General"}
              </span>
              {getStatusBadge(note.status)}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {note.title}
            </h1>

            <div className="flex items-center space-x-4 text-xs text-slate-500 pt-2">
              <span className="flex items-center space-x-1 font-medium text-slate-700">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span>
                  Author ID:{" "}
                  {note.author_id ? note.author_id.substring(0, 8) : "Employee"}
                </span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>
                  Created {new Date(note.created_at).toLocaleDateString()}
                </span>
              </span>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-sans min-h-[250px]">
            {note.body}
          </div>
        </main>

        <aside className="lg:col-span-4 space-y-6">
          {note.tags && note.tags.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                <TagIcon className="h-4 w-4 text-emerald-600" />
                <span>Taxonomy Tags</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {note.tags.map((t) => {
                  const name = typeof t === "string" ? t : t.name;
                  return (
                    <span
                      key={name}
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200"
                    >
                      #{name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {note.citations && note.citations.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                <Link2 className="h-4 w-4 text-emerald-600" />
                <span>Reference Citations ({note.citations.length})</span>
              </h3>
              <ul className="space-y-2 text-xs">
                {note.citations.map((c) => (
                  <li
                    key={c.id || c.title}
                    className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1"
                  >
                    <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                      {c.citation_type === "CONFLUENCE" ? (
                        <FileText className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                      ) : (
                        <ExternalLink className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                      )}
                      <span>{c.title}</span>
                    </div>
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-600 hover:underline block truncate text-[11px]"
                    >
                      {c.url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(reviews.length > 0 ||
            (note.reviews && note.reviews.length > 0)) && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>SME Review Audit Trail</span>
              </h3>
              <div className="space-y-2 text-xs">
                {(reviews.length > 0 ? reviews : note.reviews).map((r) => (
                  <div
                    key={r.id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-bold ${r.action === "APPROVE" ? "text-emerald-700" : "text-red-700"}`}
                      >
                        {r.action === "APPROVE"
                          ? "Approved by SME"
                          : "Rejected by SME"}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(r.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {r.feedback && (
                      <p className="text-slate-600 italic bg-white p-2 rounded border border-slate-100 mt-1">
                        "{r.feedback}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default NoteDetailPage;
