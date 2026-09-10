import React from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Tag as TagIcon,
  Link2,
  Calendar,
  User,
  ArrowRight,
} from "lucide-react";

export function NoteCard({ note }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            <span>Approved</span>
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
            <XCircle className="h-3 w-3 text-red-600" />
            <span>Rejected</span>
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="h-3 w-3 text-amber-600" />
            <span>Pending Review</span>
          </span>
        );
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded">
              {note.category || "General"}
            </span>
            {getStatusBadge(note.status)}
          </div>
          {note.citations && note.citations.length > 0 && (
            <span
              className="inline-flex items-center space-x-1 text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200"
              title="Citations attached"
            >
              <Link2 className="h-3 w-3 text-slate-400" />
              <span>{note.citations.length}</span>
            </span>
          )}
        </div>

        <Link to={`/notes/${note.id}`} className="block group mb-2">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition leading-snug">
            {note.title}
          </h3>
        </Link>

        <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
          {note.body}
        </p>
      </div>

      <div>
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {note.tags.map((tag) => {
              const name = typeof tag === "string" ? tag : tag.name;
              return (
                <span
                  key={typeof tag === "string" ? tag : tag.id || tag.name}
                  className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-100"
                >
                  <TagIcon className="h-2.5 w-2.5" />
                  <span>{name}</span>
                </span>
              );
            })}
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <User className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-medium text-slate-700">
                {note.author_id ? "Employee" : "Author"}
              </span>
            </span>
            <span className="flex items-center space-x-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>{formatDate(note.created_at)}</span>
            </span>
          </div>

          <Link
            to={`/notes/${note.id}`}
            className="inline-flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 font-semibold transition"
          >
            <span>Read</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NoteCard;
