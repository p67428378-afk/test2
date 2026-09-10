import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import ResumeForm, { SAMPLE_RESUME_DATA } from "../components/ResumeForm";
import ResumePreview from "../components/ResumePreview";
import { resumeService } from "../services/api";
import {
  Download,
  Save,
  AlertCircle,
  CheckCircle2,
  FileText,
  Sparkles,
  Info,
  RefreshCw,
  Eye,
  Sliders,
} from "lucide-react";

export default function HomePage() {
  const [resumeData, setResumeData] = useState(SAMPLE_RESUME_DATA);
  const [savedResumeId, setSavedResumeId] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string }
  const [activeViewMode, setActiveViewMode] = useState("split"); // 'split' | 'preview' | 'form'

  // Fetch templates on load
  useEffect(() => {
    let isMounted = true;
    const fetchTemplates = async () => {
      try {
        const data = await resumeService.getTemplates();
        if (isMounted && Array.isArray(data)) {
          setTemplates(data);
        }
      } catch (err) {
        console.warn(
          "Could not load backend templates list; fallback to local templates",
          err,
        );
      }
    };
    fetchTemplates();
    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const handleLoadSample = () => {
    setResumeData(SAMPLE_RESUME_DATA);
    showToast("success", "Sample resume data loaded successfully.");
  };

  const handleReset = () => {
    setResumeData({
      user_name: "",
      email: "",
      phone: "",
      portfolio_url: "",
      template_id: "classic",
      experiences: [],
      education: [],
      skills: [],
    });
    setSavedResumeId(null);
    showToast("success", "Form cleared.");
  };

  const handleTemplateChange = (templateId) => {
    setResumeData((prev) => ({ ...prev, template_id: templateId }));
  };

  // Export PDF Handler
  const handleExportPdf = async () => {
    if (!resumeData.user_name || !resumeData.email) {
      showToast(
        "error",
        "Please provide at least your Full Name and a valid Email Address before exporting.",
      );
      return;
    }

    if (!resumeData.email.includes("@") || !resumeData.email.includes(".")) {
      showToast(
        "error",
        "Please enter a valid email address (e.g., jane.doe@example.com).",
      );
      return;
    }

    setIsExporting(true);
    try {
      const payload = {
        resume_id: savedResumeId,
        user_name: resumeData.user_name,
        email: resumeData.email,
        phone: resumeData.phone || null,
        portfolio_url: resumeData.portfolio_url || null,
        template_id: resumeData.template_id || "classic",
        experiences: resumeData.experiences || [],
        education: resumeData.education || [],
        skills: resumeData.skills || [],
      };

      const pdfBlob = await resumeService.exportPdf(payload);

      // Create download link
      const blobUrl = window.URL.createObjectURL(
        new Blob([pdfBlob], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = blobUrl;
      const cleanName = resumeData.user_name
        ? resumeData.user_name.trim().replace(/\s+/g, "_")
        : "Resume";
      link.setAttribute("download", `${cleanName}_Resume.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      showToast(
        "success",
        `PDF exported successfully! Downloading ${cleanName}_Resume.pdf`,
      );
    } catch (err) {
      console.error("PDF Export Error:", err);
      const msg =
        err.response?.data?.detail ||
        "Failed to generate and download PDF CV. Please check your data and retry.";
      showToast("error", msg);
    } finally {
      setIsExporting(false);
    }
  };

  // Save to backend handler
  const handleSaveResume = async () => {
    if (!resumeData.user_name || !resumeData.email) {
      showToast(
        "error",
        "Please provide at least your Full Name and a valid Email Address.",
      );
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        user_name: resumeData.user_name,
        email: resumeData.email,
        phone: resumeData.phone || null,
        portfolio_url: resumeData.portfolio_url || null,
        template_id: resumeData.template_id || "classic",
        experiences: resumeData.experiences || [],
        education: resumeData.education || [],
        skills: resumeData.skills || [],
      };

      let result;
      if (savedResumeId) {
        result = await resumeService.updateResume(savedResumeId, payload);
        showToast("success", "Resume updated successfully online.");
      } else {
        result = await resumeService.createResume(payload);
        if (result && result.id) {
          setSavedResumeId(result.id);
        }
        showToast("success", "Resume created and saved to cloud database!");
      }
    } catch (err) {
      console.error("Save Resume Error:", err);
      const msg =
        err.response?.data?.detail ||
        "Failed to save resume. Please verify input data and server connection.";
      showToast("error", msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      {/* Top Header */}
      <Header
        onExportPdf={handleExportPdf}
        isExporting={isExporting}
        selectedTemplate={resumeData.template_id}
        onTemplateChange={handleTemplateChange}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md animate-fade-in">
          <div
            className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border text-sm ${
              toast.type === "success"
                ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                : "bg-red-50 text-red-900 border-red-300"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-semibold">
                {toast.type === "success" ? "Success" : "Error"}
              </p>
              <p className="text-xs mt-0.5">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-slate-700 text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Test Account / Info Banner */}
      <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs text-indigo-900">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>Quick Resume Maker:</strong> Input work experience, choose
              a template, and export a vector PDF CV in seconds.
            </span>
          </div>
          <div className="text-slate-600">
            <span>
              Test account: <code>test@example.com</code> /{" "}
              <code>testpassword</code>
            </span>
          </div>
        </div>
      </div>

      {/* Mobile View Switcher (Visible on small screens) */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-center gap-2 text-xs font-medium">
        <button
          onClick={() => setActiveViewMode("form")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
            activeViewMode === "form"
              ? "bg-indigo-600 text-white font-semibold"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          Edit Form
        </button>
        <button
          onClick={() => setActiveViewMode("preview")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
            activeViewMode === "preview"
              ? "bg-indigo-600 text-white font-semibold"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          Live Preview
        </button>
      </div>

      {/* Main Workspace: 2-Column Split Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Editor & Controls */}
          <section
            className={`lg:col-span-7 space-y-6 ${
              activeViewMode === "preview" ? "hidden lg:block" : "block"
            }`}
          >
            <ResumeForm
              resumeData={resumeData}
              onChange={setResumeData}
              templates={templates}
              onLoadSample={handleLoadSample}
              onReset={handleReset}
            />

            {/* Bottom Form Action Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveResume}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-50 rounded-lg transition"
                >
                  <Save className="w-4 h-4 text-slate-600" />
                  {isSaving
                    ? "Saving..."
                    : savedResumeId
                      ? "Update Resume"
                      : "Save Online"}
                </button>
                {savedResumeId && (
                  <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md font-medium">
                    ✓ Saved to Cloud
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleExportPdf}
                disabled={isExporting}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 rounded-lg shadow-md shadow-indigo-200 transition"
              >
                <Download
                  className={`w-4 h-4 ${isExporting ? "animate-bounce" : ""}`}
                />
                {isExporting ? "Generating PDF..." : "Export & Download PDF"}
              </button>
            </div>
          </section>

          {/* Right Column: Live A4 Document Preview */}
          <section
            className={`lg:col-span-5 space-y-4 ${
              activeViewMode === "form" ? "hidden lg:block" : "block"
            }`}
          >
            {/* Live Preview Header Controls */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Live Document Preview
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-500">Template:</span>
                <span className="font-bold text-indigo-600 capitalize">
                  {resumeData.template_id}
                </span>
              </div>
            </div>

            {/* Document Preview Viewport */}
            <div className="bg-slate-200/80 p-3 sm:p-5 rounded-xl border border-slate-300 overflow-x-auto flex justify-center">
              <ResumePreview resumeData={resumeData} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
