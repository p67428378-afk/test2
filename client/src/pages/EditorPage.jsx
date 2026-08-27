import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { marked } from "marked";
import DOMPurify from "dompurify";
import DocHeader from "../components/editor/DocHeader";
import FormattingToolbar from "../components/editor/FormattingToolbar";
import MarkdownEditorTextarea from "../components/editor/MarkdownEditorTextarea";
import LiveHTMLPreview from "../components/editor/LiveHTMLPreview";
import { getDocument, createDocument, updateDocument } from "../services/api";

const DEFAULT_MARKDOWN = `# Product Specification & Live Preview

Welcome to the **Browser Markdown Editor**! 

Compose formatted text using Markdown and preview the generated HTML output in **real-time** side-by-side.

---

### Key Capabilities
- **Live HTML Preview:** Real-time rendering as you type with zero latency
- **XSS Protection:** Output sanitized automatically via **DOMPurify**
- **Rich Formatting:** Quick-toolbar controls for Headings, Bold, Lists, Code, Links, and Tables
- **Export & Copy:** Export as \`.md\` or \`.html\` or copy directly to clipboard

### Quick Code Example
\`\`\`javascript
function calculateSummary(words, chars) {
  return \`Document contains \${words} words and \${chars} characters.\`;
}
\`\`\`

### Task Checklist
- [x] Integrate React 18 & Vite
- [x] Configure Tailwind CSS styling
- [x] Live HTML split-view preview
- [x] Document persistence with PostgreSQL

> *"Markdown is a text-to-HTML conversion tool for web writers."* — John Gruber
`;

export default function EditorPage({ onDocumentSaved }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const docId = searchParams.get("id");

  const [id, setId] = useState(docId || null);
  const [title, setTitle] = useState("Product Specification.md");
  const [content, setContent] = useState(DEFAULT_MARKDOWN);
  const [saveStatus, setSaveStatus] = useState("saved"); // 'saved', 'unsaved', 'saving', 'error'
  const [copiedType, setCopiedType] = useState(null); // 'md', 'html'
  const [viewMode, setViewMode] = useState("split"); // 'split', 'editor', 'preview'
  const [errorMessage, setErrorMessage] = useState(null);
  const [successToast, setSuccessToast] = useState(null);

  const textareaRef = useRef(null);

  // Load document from backend if ID is in URL
  useEffect(() => {
    if (docId) {
      let isMounted = true;
      const fetchDoc = async () => {
        try {
          const doc = await getDocument(docId);
          if (isMounted && doc) {
            setId(doc.id);
            setTitle(doc.title || "Untitled Document.md");
            setContent(doc.content || "");
            setSaveStatus("saved");
          }
        } catch (err) {
          console.error("Failed to load document from backend:", err);
          if (isMounted) {
            setErrorMessage(`Failed to load document (${err.message})`);
          }
        }
      };
      fetchDoc();
      return () => {
        isMounted = false;
      };
    } else {
      setId(null);
    }
  }, [docId]);

  // Track changes
  const handleContentChange = (newContent) => {
    setContent(newContent);
    setSaveStatus("unsaved");
    setErrorMessage(null);
  };

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
    setSaveStatus("unsaved");
    setErrorMessage(null);
  };

  // Text stats
  const stats = useMemo(() => {
    const raw = content || "";
    const trimmed = raw.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = raw.length;
    const lines = raw ? raw.split("\n").length : 1;
    return { words, chars, lines };
  }, [content]);

  // Toolbar formatting logic
  const handleFormat = (tool) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let insertion = "";
    let newCursorStart = start;
    let newCursorEnd = end;

    if (tool.raw) {
      insertion = tool.prefix;
      newCursorStart = start + insertion.length;
      newCursorEnd = newCursorStart;
    } else if (selectedText) {
      insertion = `${tool.prefix}${selectedText}${tool.suffix}`;
      newCursorStart = start + tool.prefix.length;
      newCursorEnd = newCursorStart + selectedText.length;
    } else {
      const placeholder = tool.placeholder || "";
      insertion = `${tool.prefix}${placeholder}${tool.suffix}`;
      newCursorStart = start + tool.prefix.length;
      newCursorEnd = newCursorStart + placeholder.length;
    }

    const updatedContent =
      content.substring(0, start) + insertion + content.substring(end);
    handleContentChange(updatedContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorStart, newCursorEnd);
    }, 0);
  };

  // Keyboard shortcut handlers
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
      e.preventDefault();
      handleFormat({ prefix: "**", suffix: "**", placeholder: "Bold Text" });
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
      e.preventDefault();
      handleFormat({ prefix: "*", suffix: "*", placeholder: "Italic Text" });
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      handleSave();
    }
  };

  // Save document to backend
  const handleSave = async () => {
    setSaveStatus("saving");
    setErrorMessage(null);
    try {
      const payload = {
        title: title.trim() || "Untitled Document.md",
        content: content,
      };

      let result;
      if (id) {
        result = await updateDocument(id, payload);
      } else {
        result = await createDocument(payload);
        if (result?.id) {
          setId(result.id);
          setSearchParams({ id: result.id }, { replace: true });
        }
      }

      setSaveStatus("saved");
      setSuccessToast("Document saved successfully to database!");
      setTimeout(() => setSuccessToast(null), 3000);
      if (onDocumentSaved) {
        onDocumentSaved();
      }
    } catch (err) {
      console.error("Save failed:", err);
      setSaveStatus("error");
      setErrorMessage(
        `Failed to save document: ${err.response?.data?.detail || err.message}`,
      );
    }
  };

  // Export .md file download
  const handleExportMarkdown = () => {
    const filename =
      (title.trim() || "document").replace(/[/\\?%*:|"<>]/g, "-") +
      (title.endsWith(".md") ? "" : ".md");
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSuccessToast(`Exported ${filename}`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Export .html file download
  const handleExportHTML = () => {
    try {
      const rawHtml = marked.parse(content || "");
      const sanitized = DOMPurify.sanitize(rawHtml);
      const filename =
        (title.trim() || "document")
          .replace(/[/\\?%*:|"<>]/g, "-")
          .replace(/\.md$/, "") + ".html";

      const fullHTMLDocument = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 40px auto; padding: 0 20px; }
    h1, h2, h3 { color: #0f172a; }
    pre { background: #0f172a; color: #f8fafc; padding: 16px; border-radius: 8px; overflow-x: auto; }
    code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
    blockquote { border-left: 4px solid #3b82f6; margin: 16px 0; padding: 8px 16px; background: #f8fafc; color: #475569; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    th { background: #f8fafc; }
    a { color: #2563eb; }
  </style>
</head>
<body>
  ${sanitized}
</body>
</html>`;

      const blob = new Blob([fullHTMLDocument], {
        type: "text/html;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccessToast(`Exported ${filename}`);
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err) {
      console.error("Export HTML failed:", err);
      setErrorMessage("Failed to generate HTML export");
    }
  };

  // Copy raw Markdown to clipboard
  const handleCopyMarkdown = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(content);
        setCopiedType("md");
        setTimeout(() => setCopiedType(null), 2000);
        setSuccessToast("Markdown copied to clipboard!");
        setTimeout(() => setSuccessToast(null), 3000);
      }
    } catch (err) {
      console.error("Copy Markdown failed:", err);
      setErrorMessage("Failed to copy Markdown to clipboard");
    }
  };

  // Copy rendered HTML to clipboard
  const handleCopyHTML = async () => {
    try {
      const rawHtml = marked.parse(content || "");
      const sanitized = DOMPurify.sanitize(rawHtml);
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(sanitized);
        setCopiedType("html");
        setTimeout(() => setCopiedType(null), 2000);
        setSuccessToast("Rendered HTML copied to clipboard!");
        setTimeout(() => setSuccessToast(null), 3000);
      }
    } catch (err) {
      console.error("Copy HTML failed:", err);
      setErrorMessage("Failed to copy HTML to clipboard");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      {/* Toast Feedback */}
      {successToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-700 text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center space-x-2 text-sm animate-fade-in">
          <span>✓</span>
          <span>{successToast}</span>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-xs text-red-700 flex justify-between items-center">
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-700 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Document Header */}
      <DocHeader
        title={title}
        setTitle={handleTitleChange}
        saveStatus={saveStatus}
        onSave={handleSave}
        onExportMarkdown={handleExportMarkdown}
        onExportHTML={handleExportHTML}
        onCopyMarkdown={handleCopyMarkdown}
        onCopyHTML={handleCopyHTML}
        copiedType={copiedType}
        viewMode={viewMode}
        setViewMode={setViewMode}
        stats={stats}
      />

      {/* Quick Formatting Toolbar (visible in split & editor modes) */}
      {viewMode !== "preview" && <FormattingToolbar onFormat={handleFormat} />}

      {/* Main Workspace (Split View / Editor / Preview) */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Editor Area */}
        {viewMode !== "preview" && (
          <div
            className={`${viewMode === "split" ? "w-1/2" : "w-full"} flex flex-col h-full min-h-0`}
          >
            <MarkdownEditorTextarea
              value={content}
              onChange={handleContentChange}
              textareaRef={textareaRef}
              onKeyDown={handleKeyDown}
            />
          </div>
        )}

        {/* Live Preview Area */}
        {viewMode !== "editor" && (
          <div
            className={`${viewMode === "split" ? "w-1/2" : "w-full"} flex flex-col h-full min-h-0`}
          >
            <LiveHTMLPreview markdownContent={content} />
          </div>
        )}
      </div>
    </div>
  );
}
