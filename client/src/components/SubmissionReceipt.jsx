import React from "react";
import {
  CheckCircle2,
  Clock,
  FileText,
  Award,
  MessageSquare,
} from "lucide-react";

const SubmissionReceipt = ({ receipt, submission }) => {
  const data = receipt || submission;
  if (!data) return null;

  const isLate = data.is_late;
  const fileName = data.file_name || data.file_path || "submission.pdf";
  const submittedAt = data.submitted_at
    ? new Date(data.submitted_at).toUTCString()
    : "Oct 14, 2026 at 18:32 UTC";

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-slate-200 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Submission Receipt</span>
        </h4>
        <span
          className={`px-2.5 py-0.5 text-xs font-bold rounded ${
            isLate
              ? "bg-amber-100 text-amber-800"
              : "bg-emerald-100 text-emerald-800"
          }`}
        >
          {data.status_badge ||
            (isLate ? "Late Submission" : "On-Time Submission")}
        </span>
      </div>

      <div className="space-y-2 text-xs text-slate-600">
        <p className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-400" />
          <span>File: </span>
          <span className="font-semibold text-slate-900">{fileName}</span>
        </p>
        <p className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>Submitted: </span>
          <span className="text-slate-700">{submittedAt}</span>
        </p>
      </div>

      {data.grade !== null && data.grade !== undefined && (
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2 mt-3">
          <div className="flex justify-between items-center font-bold text-slate-800 text-sm">
            <span className="flex items-center gap-1.5 text-indigo-950">
              <Award className="w-4 h-4 text-amber-500" /> Grade
            </span>
            <span className="text-emerald-700 text-base font-extrabold">
              {data.grade} / 100
            </span>
          </div>
          {data.feedback && (
            <div className="text-xs text-slate-600 flex items-start gap-1.5 italic bg-white p-2.5 rounded border border-slate-100">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
              <span>"{data.feedback}"</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubmissionReceipt;
