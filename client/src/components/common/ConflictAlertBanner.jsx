import React from "react";
import { AlertTriangle, XCircle, Info } from "lucide-react";

export default function ConflictAlertBanner({
  error,
  onDismiss,
  title = "409 Conflict — Category Already Exists",
}) {
  if (!error) return null;

  const errorMessage =
    typeof error === "string"
      ? error
      : error?.response?.data?.detail ||
        error?.message ||
        "A duplicate category error or network issue occurred.";

  const isConflict =
    error?.response?.status === 409 ||
    errorMessage.toLowerCase().includes("conflict") ||
    errorMessage.toLowerCase().includes("already exists");

  return (
    <div
      role="alert"
      className={`p-4 rounded-xl border flex items-start justify-between gap-3 transition-all ${
        isConflict
          ? "bg-red-50 border-red-200 text-red-800"
          : "bg-amber-50 border-amber-200 text-amber-800"
      }`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className={`w-5 h-5 shrink-0 mt-0.5 ${
            isConflict ? "text-red-600" : "text-amber-600"
          }`}
        />
        <div>
          <p className="text-xs font-bold uppercase tracking-wide">
            {isConflict ? title : "API Error Notification"}
          </p>
          <p className="text-xs mt-1 leading-relaxed">{errorMessage}</p>
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          aria-label="Dismiss error"
        >
          <XCircle className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
