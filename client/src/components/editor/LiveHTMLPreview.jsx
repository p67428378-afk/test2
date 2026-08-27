import React, { useMemo, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { Eye, Code2, ShieldCheck, Copy, Check } from "lucide-react";

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
  pedantic: false,
});

export default function LiveHTMLPreview({ markdownContent }) {
  const [showRawHTML, setShowRawHTML] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);

  // Generate sanitized HTML from Markdown
  const sanitizedHTML = useMemo(() => {
    if (!markdownContent || !markdownContent.trim()) {
      return "";
    }
    try {
      const rawHtml = marked.parse(markdownContent);
      // Ensure DOMPurify runs safely across environments
      if (typeof window !== "undefined" && DOMPurify.sanitize) {
        return DOMPurify.sanitize(rawHtml, {
          USE_PROFILES: { html: true },
          ADD_ATTR: ["target", "rel"],
        });
      }
      return rawHtml;
    } catch (err) {
      console.error("Markdown parsing error:", err);
      return `<p class="text-red-500">Error parsing Markdown: ${err.message}</p>`;
    }
  }, [markdownContent]);

  const handleCopyRaw = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(sanitizedHTML);
        setCopiedRaw(true);
        setTimeout(() => setCopiedRaw(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy raw HTML:", err);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAFCFF] border-l border-gray-200">
      {/* Header bar for Live Preview */}
      <div className="bg-gray-50/50 border-b border-gray-100 px-4 py-1.5 flex items-center justify-between text-xs text-gray-500 font-mono">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-semibold text-gray-700">LIVE HTML PREVIEW</span>
          <div className="hidden sm:flex items-center space-x-1 text-[11px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
            <ShieldCheck className="w-3 h-3 text-green-600" />
            <span>XSS Safe</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowRawHTML(!showRawHTML)}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium transition ${
              showRawHTML
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-200/60"
            }`}
          >
            <Code2 className="w-3 h-3" />
            <span>{showRawHTML ? "Rendered View" : "Raw HTML Code"}</span>
          </button>
        </div>
      </div>

      {/* Content display */}
      <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-white">
        {sanitizedHTML ? (
          showRawHTML ? (
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono text-gray-500">
                  Rendered HTML Output
                </span>
                <button
                  onClick={handleCopyRaw}
                  className="flex items-center space-x-1 text-xs text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition"
                >
                  {copiedRaw ? (
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedRaw ? "Copied!" : "Copy Code"}</span>
                </button>
              </div>
              <pre className="bg-gray-900 text-emerald-400 p-4 rounded-lg font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                <code>{sanitizedHTML}</code>
              </pre>
            </div>
          ) : (
            <div
              className="markdown-preview max-w-none prose prose-blue"
              data-testid="live-preview-container"
              dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
            />
          )
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400">
            <Eye className="w-10 h-10 mb-3 text-gray-300 animate-pulse" />
            <p className="text-sm font-medium text-gray-500">
              Live preview will render here
            </p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              Type Markdown in the editor or select formatting tools to see
              immediate HTML rendering.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
