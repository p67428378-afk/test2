import React, { useState, useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { Eye, Code2, ShieldCheck, Copy, Check } from "lucide-react";

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
});

export default function LiveHTMLPreviewPane({
  markdown = "",
  enableSanitization = true,
}) {
  const [viewMode, setViewMode] = useState("preview"); // 'preview' | 'html'
  const [copied, setCopied] = useState(false);

  // Parse markdown and sanitize HTML, track parse latency
  const { html, rawSanitizedHtml, renderLatencyMs } = useMemo(() => {
    const startTime = performance.now();
    let rawHtml = "";
    try {
      rawHtml = marked.parse(markdown || "");
    } catch (err) {
      rawHtml = `<p class="text-red-500">Error rendering markdown: ${err.message}</p>`;
    }

    const sanitizedHtml = enableSanitization
      ? DOMPurify.sanitize(rawHtml, {
          USE_PROFILES: { html: true },
          ADD_ATTR: ["target"],
        })
      : rawHtml;

    const endTime = performance.now();
    return {
      html: sanitizedHtml,
      rawSanitizedHtml: sanitizedHtml,
      renderLatencyMs: Math.max(0.1, Number((endTime - startTime).toFixed(1))),
    };
  }, [markdown, enableSanitization]);

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(rawSanitizedHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // Fallback
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border border-[#E3E8F0] rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#FAFCFF] border-b border-[#E3E8F0] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm font-semibold text-[#171C29]">
          <Eye className="w-4 h-4 text-brand-blue" />
          <span>Live HTML Preview</span>
        </div>

        {/* View toggles & Actions */}
        <div className="flex items-center space-x-2">
          <div className="bg-[#F2F5FA] p-0.5 rounded-lg border border-[#E3E8F0] flex items-center">
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === "preview"
                  ? "bg-white text-brand-blue shadow-sm"
                  : "text-[#707A8C] hover:text-[#171C29]"
              }`}
            >
              Visual
            </button>
            <button
              type="button"
              onClick={() => setViewMode("html")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === "html"
                  ? "bg-white text-brand-blue shadow-sm"
                  : "text-[#707A8C] hover:text-[#171C29]"
              }`}
            >
              HTML Code
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyHtml}
            title="Copy HTML output"
            className="p-1.5 rounded-md text-[#707A8C] hover:text-brand-blue hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100"
          >
            {copied ? (
              <Check className="w-4 h-4 text-brand-accent" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Preview Content Area */}
      <div className="flex-1 p-6 overflow-y-auto bg-white">
        {viewMode === "preview" ? (
          markdown.trim() ? (
            <div
              className="markdown-preview"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-[#707A8C] text-sm">
              <Eye className="w-10 h-10 mb-2 stroke-1 text-gray-300" />
              <p>Your formatted HTML preview will appear here in real-time.</p>
            </div>
          )
        ) : (
          <pre className="font-mono text-xs text-[#1E293B] bg-[#F8FAFC] p-4 rounded border border-[#E3E8F0] overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
            {rawSanitizedHtml || "<!-- HTML output will appear here -->"}
          </pre>
        )}
      </div>

      {/* Footer Status Bar */}
      <div className="bg-[#F2F5FA] border-t border-[#E3E8F0] px-4 py-2 flex items-center justify-between text-xs text-[#707A8C]">
        <div className="flex items-center space-x-2">
          <span className="flex items-center text-brand-accent font-medium">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-brand-accent" />
            {enableSanitization
              ? "DOMPurify Active (XSS Safe)"
              : "Raw HTML (Unsanitized)"}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span>
            Latency:{" "}
            <strong className="text-brand-blue font-mono">
              {renderLatencyMs}ms
            </strong>
          </span>
          <span className="text-gray-300">|</span>
          <span>&lt; 100ms Target</span>
        </div>
      </div>
    </div>
  );
}
