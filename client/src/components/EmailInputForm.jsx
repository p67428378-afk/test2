import React, { useState } from "react";
import {
  Sparkles,
  Send,
  FileText,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Layers,
} from "lucide-react";
import FileUploadDropzone from "./FileUploadDropzone";
import { classifyEmailText, classifyEmailFile } from "../services/api";

const SAMPLE_TEMPLATES = [
  {
    label: "Urgent Alert",
    badgeColor: "bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-300",
    subject:
      "CRITICAL: Production Server Downtime Alert - Immediate Action Required",
    sender: "devops-alerts@infrastructure.internal",
    text: "URGENT ALERT: Primary cluster nodes in us-east-1 are non-responsive. Error rates have spiked above 25% for payment checkout services. All on-call engineers must immediately join the emergency incident bridge #INC-9041.",
  },
  {
    label: "Work Project",
    badgeColor: "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-300",
    subject: "Sprint 14 Retrospective & Technical Architecture Review Agenda",
    sender: "alex.lead@enterprise.com",
    text: "Hi Team, please find attached our meeting agenda for the upcoming quarterly sprint sync. We will review frontend component modularization, database migration timelines, and API contract revisions. Please update your Jira tickets prior to the call.",
  },
  {
    label: "Personal Meetup",
    badgeColor:
      "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-300",
    subject: "Family dinner & weekend catch up plans",
    sender: "jamie.smith@gmail.com",
    text: "Hey there! Are you free this Saturday evening around 7:00 PM? We are hosting a casual dinner with family and close friends at the Italian bistro downtown. Let me know if you can make it!",
  },
  {
    label: "Promotional Offer",
    badgeColor:
      "bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-300",
    subject: "Exclusive 50% Off Summer Flash Sale - Ends Midnight!",
    sender: "newsletter@megaretail.com",
    text: "Upgrade your tech workspace today! Enjoy an instant 50% discount on all ergonomic chairs, mechanical keyboards, and 4K monitors. Use promo code FLASH50 at checkout. Free 2-day priority delivery included.",
  },
];

export default function EmailInputForm({
  onClassifiedSuccess,
  onViewDashboard,
}) {
  const [inputMode, setInputMode] = useState("text"); // 'text' | 'file'
  const [sender, setSender] = useState("");
  const [subject, setSubject] = useState("");
  const [emailText, setEmailText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [lastResult, setLastResult] = useState(null);

  const charCount = emailText.length;
  const wordCount = emailText.trim() ? emailText.trim().split(/\s+/).length : 0;
  const estTokens = Math.ceil(charCount / 4);

  const handleApplyTemplate = (tmpl) => {
    setInputMode("text");
    setSender(tmpl.sender);
    setSubject(tmpl.subject);
    setEmailText(tmpl.text);
    setErrorMsg("");
    setLastResult(null);
  };

  const handleClear = () => {
    setSender("");
    setSubject("");
    setEmailText("");
    setErrorMsg("");
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!emailText.trim()) {
      setErrorMsg("Email text content is required.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setLastResult(null);

    try {
      const payload = {
        text: emailText.trim(),
        subject: subject.trim() || undefined,
        sender: sender.trim() || undefined,
      };
      const result = await classifyEmailText(payload);
      setLastResult(result);
      if (onClassifiedSuccess) {
        onClassifiedSuccess(result);
      }
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        "Classification failed. Please check network or service status.";
      setErrorMsg(
        typeof message === "string" ? message : JSON.stringify(message),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSubmit = async (formData, resetFileFn) => {
    setIsLoading(true);
    setErrorMsg("");
    setLastResult(null);

    try {
      if (subject.trim()) formData.append("subject", subject.trim());
      if (sender.trim()) formData.append("sender", sender.trim());

      const result = await classifyEmailFile(formData);
      setLastResult(result);
      if (resetFileFn) resetFileFn();
      if (onClassifiedSuccess) {
        onClassifiedSuccess(result);
      }
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        "File classification failed. Please verify file format and size.";
      setErrorMsg(
        typeof message === "string" ? message : JSON.stringify(message),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryBadgeColor = (category) => {
    switch (category?.toLowerCase()) {
      case "urgent":
        return "bg-rose-100 text-rose-800 border-rose-300";
      case "work":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "personal":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "promotional":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Email Classification Studio
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Enter email content or upload .eml, .txt, or .pdf files to run
            multi-category AI analysis.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center p-1 bg-slate-200/80 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setInputMode("text");
              setErrorMsg("");
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              inputMode === "text"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Direct Text Entry
          </button>
          <button
            type="button"
            onClick={() => {
              setInputMode("file");
              setErrorMsg("");
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              inputMode === "file"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            File Upload (.eml/.pdf/.txt)
          </button>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Quick-fill Template Chips */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              Quick Fill Sample Templates:
            </span>
            {(emailText || subject || sender) && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
              >
                Clear Fields
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.label}
                type="button"
                onClick={() => handleApplyTemplate(tmpl)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${tmpl.badgeColor}`}
              >
                + {tmpl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Metadata Inputs (Sender & Subject) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="email-sender"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Sender Address (Optional)
            </label>
            <input
              id="email-sender"
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="e.g., alert@company.com or John Doe"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>

          <div>
            <label
              htmlFor="email-subject"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Subject Line (Optional)
            </label>
            <input
              id="email-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Important Security Notification"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Mode Content: Direct Text Area or File Dropzone */}
        {inputMode === "text" ? (
          <form onSubmit={handleTextSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="email-body"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Email Content / Raw Body Text{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                  <span>{charCount} chars</span>
                  <span>•</span>
                  <span>{wordCount} words</span>
                  <span>•</span>
                  <span>~{estTokens} tokens</span>
                </div>
              </div>
              <textarea
                id="email-body"
                rows={7}
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                placeholder="Paste the full email body, RFC headers, or message text here to categorize..."
                className="w-full p-3.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:font-sans placeholder:text-slate-400"
                required
              />
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Classification Error</p>
                  <p>{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={isLoading || !emailText.trim()}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-100 transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Analyzing Content...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Run AI Classification
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <FileUploadDropzone
              onFileSubmit={handleFileSubmit}
              isLoading={isLoading}
            />

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Upload Error</p>
                  <p>{errorMsg}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Live Result Feedback Banner */}
        {lastResult && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 animate-fadeIn">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-slate-900">
                    Email Classified Successfully!
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getCategoryBadgeColor(
                      lastResult.classification?.primary_category,
                    )}`}
                  >
                    {lastResult.classification?.primary_category || "Work"}
                  </span>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                    {lastResult.classification?.confidence_score?.toFixed(1) ||
                      "0.0"}
                    % confidence
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                  {lastResult.subject ||
                    lastResult.excerpt ||
                    "Email record saved."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={onViewDashboard}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
              >
                View on Dashboard →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
