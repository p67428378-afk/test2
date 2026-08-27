import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Save,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileDown,
  ArrowLeft,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import MarkdownEditorPane from "../components/editor/MarkdownEditorPane";
import LiveHTMLPreviewPane from "../components/editor/LiveHTMLPreviewPane";
import ExportSettingsModal from "../components/modals/ExportSettingsModal";
import { getDocument, createDocument, updateDocument } from "../services/api";

const DEFAULT_MARKDOWN = `# Welcome to MarkdownStudio 🚀

MarkdownStudio is a powerful, web-based Markdown editor with **instant live HTML preview** and automatic cloud synchronization.

## 🌟 Key Features
- **Live HTML Preview**: Sub-100ms real-time rendering.
- **Rich Formatting Toolbar**: Quick-action formatting for headings, lists, code, and tables.
- **XSS Sanitization**: Protected via DOMPurify.
- **Auto-Save**: Changes persist seamlessly every 30 seconds.

---

### 📝 Code Block Example
\`\`\`javascript
function calculatePreviewLatency(start, end) {
  return (end - start).toFixed(2) + 'ms';
}
console.log("Ready to compose!");
\`\`\`

### 📊 Markdown Table Example
| Feature | Supported | Notes |
| :--- | :--- | :--- |
| Live Preview | ✅ Yes | Sub-100ms latency |
| DOMPurify | ✅ Yes | XSS Protection |
| 5MB Limit | ✅ Yes | Validated locally |

> **Pro-Tip**: Use \`Ctrl+B\` for bold, \`Ctrl+I\` for italic, and \`Tab\` to indent!
`;

export default function EditorWorkspacePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const [documentId, setDocumentId] = useState(id || null);
  const [title, setTitle] = useState("Untitled Document");
  const [content, setContent] = useState(DEFAULT_MARKDOWN);
  const [lastSavedContent, setLastSavedContent] = useState("");
  const [lastSavedTitle, setLastSavedTitle] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("clean"); // 'clean' | 'dirty' | 'saving' | 'saved' | 'error'
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Modal & Settings state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [enableSanitization, setEnableSanitization] = useState(true);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Detect dirty state
  const isDirty = content !== lastSavedContent || title !== lastSavedTitle;

  // Load existing document if id is in URL
  useEffect(() => {
    if (id) {
      setIsSaving(true);
      getDocument(id)
        .then((doc) => {
          setDocumentId(doc.id);
          setTitle(doc.title || "Untitled Document");
          setContent(doc.content || "");
          setLastSavedContent(doc.content || "");
          setLastSavedTitle(doc.title || "Untitled Document");
          setLastSavedAt(new Date(doc.updated_at));
          setSaveStatus("clean");
        })
        .catch((err) => {
          setErrorMessage(
            "Unable to load document: " +
              (err.response?.data?.detail || err.message),
          );
          setSaveStatus("error");
        })
        .finally(() => {
          setIsSaving(false);
        });
    } else {
      setLastSavedContent(DEFAULT_MARKDOWN);
      setLastSavedTitle("Untitled Document");
      setSaveStatus("clean");
    }
  }, [id]);

  // Save handler (POST for new, PUT for existing)
  const handleSave = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveStatus("saving");
    setErrorMessage(null);

    try {
      if (documentId) {
        const updated = await updateDocument(documentId, { title, content });
        setLastSavedContent(updated.content);
        setLastSavedTitle(updated.title);
        setLastSavedAt(new Date(updated.updated_at));
        setSaveStatus("saved");
      } else {
        const created = await createDocument({ title, content });
        setDocumentId(created.id);
        setLastSavedContent(created.content);
        setLastSavedTitle(created.title);
        setLastSavedAt(new Date(created.created_at));
        setSaveStatus("saved");
        // Update URL without full reload
        navigate(`/editor/${created.id}`, { replace: true });
      }
    } catch (err) {
      setSaveStatus("error");
      setErrorMessage(
        "Save failed: " +
          (err.response?.data?.detail || err.message || "Network timeout"),
      );
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, documentId, title, content, navigate]);

  // 30s Auto-save timer if dirty
  useEffect(() => {
    if (!autoSaveEnabled || !isDirty) return;

    const interval = setInterval(() => {
      handleSave();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoSaveEnabled, isDirty, handleSave]);

  // Browser navigation warning for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#F7FAFC]">
      {/* Control Bar Header */}
      <div className="bg-white border-b border-[#E3E8F0] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Left: Back + Title input */}
        <div className="flex items-center space-x-3 flex-1 min-w-[240px]">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="p-1.5 rounded-lg text-[#707A8C] hover:text-[#171C29] hover:bg-gray-100 transition-colors"
            title="Back to Document Library"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document Title"
            aria-label="Document Title"
            className="text-lg font-bold text-[#171C29] bg-transparent hover:bg-gray-50 focus:bg-white border border-transparent hover:border-gray-200 focus:border-brand-blue rounded px-2.5 py-1 focus:outline-none transition-all flex-1 max-w-md"
          />

          {documentId && (
            <span className="hidden lg:inline-block text-xs font-mono text-[#707A8C] bg-gray-100 px-2 py-0.5 rounded">
              UUID: {documentId.substring(0, 8)}...
            </span>
          )}
        </div>

        {/* Right: Status badge + Actions */}
        <div className="flex items-center space-x-3">
          {/* Status Badge */}
          <div className="flex items-center text-xs">
            {isSaving ? (
              <span className="flex items-center text-brand-blue font-medium">
                <RefreshCw className="w-3.5 h-3.5 mr-1 animate-spin" />
                Saving...
              </span>
            ) : isDirty ? (
              <span className="flex items-center text-brand-warning font-medium">
                <Clock className="w-3.5 h-3.5 mr-1" />
                Unsaved changes
              </span>
            ) : saveStatus === "saved" || lastSavedAt ? (
              <span className="flex items-center text-brand-accent font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Saved{" "}
                {lastSavedAt
                  ? `(${lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})`
                  : ""}
              </span>
            ) : null}
          </div>

          {/* Export & Settings Button */}
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-sm font-medium text-[#171C29] bg-white border border-[#E3E8F0] hover:bg-gray-50 rounded-lg shadow-sm transition-colors"
          >
            <FileDown className="w-4 h-4 text-brand-blue" />
            <span>Export & Settings</span>
          </button>

          {/* Manual Save Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center space-x-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-all ${
              isDirty
                ? "bg-brand-blue hover:bg-blue-700"
                : "bg-brand-blue opacity-90 hover:opacity-100"
            }`}
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Non-intrusive Error Notification Banner */}
      {errorMessage && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-2.5 text-xs text-brand-error flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-700 font-bold hover:underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Two-Column Editor & Preview Workspace */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 min-h-0 overflow-hidden">
        {/* Left Column: Markdown Input & Toolbar */}
        <div className="h-full min-h-0">
          <MarkdownEditorPane
            ref={editorRef}
            content={content}
            onChange={(newVal) => setContent(newVal)}
            disabled={isSaving && !documentId}
          />
        </div>

        {/* Right Column: Real-time HTML Preview */}
        <div className="h-full min-h-0">
          <LiveHTMLPreviewPane
            markdown={content}
            enableSanitization={enableSanitization}
          />
        </div>
      </div>

      {/* Export & Settings Modal */}
      <ExportSettingsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        documentData={{ id: documentId, title, content }}
        enableSanitization={enableSanitization}
        onToggleSanitization={setEnableSanitization}
        autoSaveEnabled={autoSaveEnabled}
        onToggleAutoSave={setAutoSaveEnabled}
      />
    </div>
  );
}
