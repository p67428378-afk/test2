import React, { useState, useEffect } from "react";
import ResumeForm, { SAMPLE_RESUME_DATA } from "../components/ResumeForm";
import ResumePreview from "../components/ResumePreview";
import { resumeService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Download, CheckCircle, AlertCircle, Save } from "lucide-react";

export default function ResumeBuilderPage() {
  const { user } = useAuth();
  const [resumeData, setResumeData] = useState(() => {
    return {
      ...SAMPLE_RESUME_DATA,
      user_name: user?.full_name || SAMPLE_RESUME_DATA.user_name,
      email: user?.email || SAMPLE_RESUME_DATA.email,
    };
  });
  const [templates, setTemplates] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await resumeService.getTemplates();
        setTemplates(data || []);
      } catch {
        // Fallback gracefully
      }
    };
    fetchTemplates();
  }, []);

  const handleLoadSample = () => {
    setResumeData({
      ...SAMPLE_RESUME_DATA,
      user_name: user?.full_name || SAMPLE_RESUME_DATA.user_name,
      email: user?.email || SAMPLE_RESUME_DATA.email,
    });
    setStatusMessage("Loaded sample resume data.");
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleReset = () => {
    setResumeData({
      user_name: user?.full_name || "",
      email: user?.email || "",
      phone: "",
      portfolio_url: "",
      template_id: "classic",
      experiences: [],
      education: [],
      skills: [],
    });
    setStatusMessage("Cleared resume fields.");
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleSaveResume = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      await resumeService.createResume(resumeData);
      setStatusMessage("Resume saved successfully!");
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.detail ||
          "Failed to save resume. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    setErrorMessage(null);
    setStatusMessage(null);
    try {
      const blobData = await resumeService.exportPdf(resumeData);
      // Create download link for [User_Name]_Resume.pdf
      const safeUserName = (resumeData.user_name || "User").replace(
        /\s+/g,
        "_",
      );
      const filename = `${safeUserName}_Resume.pdf`;

      const blob = new Blob([blobData], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setStatusMessage(`Successfully downloaded ${filename}`);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.detail ||
          "Failed to generate PDF CV. Please check input data and retry.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top action bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Interactive Resume Builder
          </h1>
          <p className="text-xs text-slate-500">
            Edit your details on the left, see the live document preview on the
            right.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveResume}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-slate-500" />
            {isSaving ? "Saving..." : "Save Resume"}
          </button>
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isExporting ? "Generating PDF..." : "Export PDF CV"}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {statusMessage && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div
          className="mb-6 p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-medium flex items-center gap-2"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Split grid view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6">
          <ResumeForm
            resumeData={resumeData}
            onChange={setResumeData}
            templates={templates}
            onLoadSample={handleLoadSample}
            onReset={handleReset}
          />
        </div>
        <div className="lg:col-span-6 bg-slate-200/70 p-4 sm:p-6 rounded-2xl border border-slate-300 shadow-inner sticky top-20">
          <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <span>Live A4 Paper Preview</span>
            <span className="text-[11px] font-normal lowercase bg-white px-2 py-0.5 rounded border border-slate-300">
              Template: {resumeData.template_id}
            </span>
          </div>
          <ResumePreview resumeData={resumeData} />
        </div>
      </div>
    </div>
  );
}
