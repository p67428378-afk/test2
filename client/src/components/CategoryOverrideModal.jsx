import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  AlertOctagon,
  CheckCircle2,
  Sparkles,
  Edit3,
  Calendar,
  User,
  Hash,
  Loader2,
  Tag,
  Share2,
} from "lucide-react";
import CategoryOverrideDropdown from "./CategoryOverrideDropdown";
import { overrideCategory } from "../services/api";

const CATEGORIES = ["Work", "Personal", "Urgent", "Promotional"];

export default function CategoryOverrideModal({
  email,
  isOpen,
  onClose,
  onUpdated,
}) {
  const [selectedCategory, setSelectedCategory] = useState("Work");
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackNote, setFeedbackNote] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (email) {
      const activeCat =
        email.classification?.user_override_category ||
        email.classification?.primary_category ||
        email.classification?.ai_category ||
        "Work";
      setSelectedCategory(activeCat);
      setFeedbackNote("");
      setSaveSuccess(false);
      setErrorMsg("");
    }
  }, [email]);

  if (!isOpen || !email) return null;

  const aiCategory =
    email.classification?.ai_category ||
    email.classification?.primary_category ||
    "Work";
  const isOverridden = email.classification?.is_overridden;
  const confidence = email.classification?.confidence_score ?? 0;

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg("");
    setSaveSuccess(false);

    try {
      const updated = await overrideCategory(email.id, selectedCategory);
      setSaveSuccess(true);
      if (onUpdated) {
        onUpdated(updated);
      }
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2500);
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to save category override.";
      setErrorMsg(
        typeof message === "string" ? message : JSON.stringify(message),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryTheme = (cat) => {
    switch (cat?.toLowerCase()) {
      case "urgent":
        return {
          bg: "bg-rose-50 text-rose-700 border-rose-200",
          bar: "bg-rose-500",
        };
      case "work":
        return {
          bg: "bg-blue-50 text-blue-700 border-blue-200",
          bar: "bg-blue-500",
        };
      case "personal":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          bar: "bg-emerald-500",
        };
      case "promotional":
        return {
          bg: "bg-purple-50 text-purple-700 border-purple-200",
          bar: "bg-purple-500",
        };
      default:
        return {
          bg: "bg-slate-50 text-slate-700 border-slate-200",
          bar: "bg-slate-500",
        };
    }
  };

  const theme = getCategoryTheme(selectedCategory);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="override-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/70 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                Inspection & Override
              </span>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Hash className="w-3 h-3" />
                {email.id.substring(0, 8)}...
              </span>
            </div>
            <h2
              id="override-modal-title"
              className="text-lg font-bold text-slate-900 line-clamp-1"
            >
              {email.subject ||
                (email.file_name
                  ? `File: ${email.file_name}`
                  : "Email Inspection")}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Metadata Highlights Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-slate-400">Sender</p>
                <p className="font-semibold text-slate-800 truncate">
                  {email.sender || "Not Specified"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-slate-400">Source</p>
                <p className="font-semibold text-slate-800">
                  {email.source_type === "FILE_UPLOAD"
                    ? `File (${email.file_name || ".eml/.pdf"})`
                    : "Direct Text Entry"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-slate-400">Ingested At</p>
                <p className="font-semibold text-slate-800">
                  {email.created_at
                    ? new Date(email.created_at).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* AI Categorization Breakdown Card */}
          <div className="p-4 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/50 to-violet-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  AI Classification Analysis
                </h4>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                {confidence.toFixed(1)}% Confidence
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-slate-500">Predicted Category: </span>
                <span className="font-bold text-slate-900">{aiCategory}</span>
              </div>
              <div>
                <span className="text-slate-500">Status: </span>
                {isOverridden ? (
                  <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    User Overridden
                  </span>
                ) : (
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    AI Auto-Assigned
                  </span>
                )}
              </div>
            </div>

            {/* Confidence Progress Meter */}
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${theme.bar}`}
                style={{ width: `${Math.min(100, Math.max(5, confidence))}%` }}
              />
            </div>
          </div>

          {/* Raw Email Content Viewer */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Raw Email Body Content:
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {email.body_text?.length || 0} characters
              </span>
            </div>
            <div className="p-3.5 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner border border-slate-800">
              {email.body_text || "No body content available."}
            </div>
          </div>

          {/* User Category Override Section */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-slate-700" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Manual Category Override
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Select Verified Category:
                </label>
                <div className="flex items-center gap-2">
                  <CategoryOverrideDropdown
                    currentCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    size="md"
                  />
                  <span className="text-xs text-slate-500">
                    {selectedCategory === aiCategory
                      ? "(Matches AI)"
                      : "(Overrides AI)"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Optional Feedback / Audit Note:
                </label>
                <input
                  type="text"
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  placeholder="e.g., Marketing newsletter mislabeled"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Feedback */}
            {saveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Category updated and saved successfully!</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Save Category
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
