import React, { useRef, useImperativeHandle, forwardRef } from "react";
import FormattingToolbar from "./FormattingToolbar";
import { AlertTriangle, FileCode } from "lucide-react";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const MarkdownEditorPane = forwardRef(function MarkdownEditorPane(
  { content = "", onChange, disabled = false },
  ref,
) {
  const textareaRef = useRef(null);

  // Compute size in bytes
  const byteSize = new Blob([content]).size;
  const isOverSizeLimit = byteSize > MAX_SIZE_BYTES;
  const isNearLimit = byteSize > MAX_SIZE_BYTES * 0.9;

  // Format size for display
  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    applyFormatting: handleApplyFormat,
    focus: () => textareaRef.current?.focus(),
    getTextarea: () => textareaRef.current,
  }));

  // Handle toolbar actions
  const handleApplyFormat = (format) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = "";
    let newCursorPos = start;

    if (format.type === "wrap") {
      const targetText = selectedText || format.placeholder || "";
      replacement = `${format.prefix}${targetText}${format.suffix}`;
      newCursorPos = selectedText
        ? start +
          format.prefix.length +
          targetText.length +
          format.suffix.length
        : start + format.prefix.length;
    } else if (format.type === "line-prefix") {
      const targetText = selectedText || format.placeholder || "";
      replacement = `${format.prefix}${targetText}`;
      newCursorPos = start + replacement.length;
    } else if (format.type === "block") {
      const targetText = selectedText || format.placeholder || "";
      replacement = `${format.prefix}${targetText}${format.suffix}`;
      newCursorPos = start + format.prefix.length;
    } else if (format.type === "link") {
      const linkText = selectedText || format.placeholder || "link text";
      replacement = `[${linkText}](https://example.com)`;
      newCursorPos = start + linkText.length + 3;
    } else if (format.type === "insert") {
      replacement = format.text || "";
      newCursorPos = start + replacement.length;
    }

    const updatedContent =
      text.substring(0, start) + replacement + text.substring(end);
    onChange(updatedContent);

    // Restore focus and cursor selection
    setTimeout(() => {
      textarea.focus();
      if (!selectedText && format.placeholder) {
        textarea.setSelectionRange(
          start + (format.prefix?.length || 0),
          start + (format.prefix?.length || 0) + format.placeholder.length,
        );
      } else {
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  // Handle keyboard shortcuts (Ctrl+B, Ctrl+I, Tab)
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
      e.preventDefault();
      handleApplyFormat({
        type: "wrap",
        prefix: "**",
        suffix: "**",
        placeholder: "bold text",
      });
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
      e.preventDefault();
      handleApplyFormat({
        type: "wrap",
        prefix: "*",
        suffix: "*",
        placeholder: "italic text",
      });
    } else if (e.key === "Tab") {
      e.preventDefault();
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const updated = text.substring(0, start) + "  " + text.substring(end);
      onChange(updated);
      setTimeout(() => {
        textarea.setSelectionRange(start + 2, start + 2);
      }, 0);
    }
  };

  // Calculate lines, words, characters
  const lines = content.split("\n").length;
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const characters = content.length;

  return (
    <div className="flex flex-col h-full bg-white border border-[#E3E8F0] rounded-lg shadow-sm overflow-hidden">
      {/* Header with Title and Toolbar */}
      <div className="bg-[#FAFCFF] border-b border-[#E3E8F0] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm font-semibold text-[#171C29]">
          <FileCode className="w-4 h-4 text-brand-blue" />
          <span>Markdown Source</span>
        </div>
        <div className="text-xs text-[#707A8C]">
          <span>{lines} lines</span>
          <span className="mx-1.5">•</span>
          <span>{words} words</span>
          <span className="mx-1.5">•</span>
          <span>{characters} chars</span>
        </div>
      </div>

      {/* Toolbar */}
      <FormattingToolbar onApplyFormat={handleApplyFormat} />

      {/* Editor Area with Line numbers simulation & textarea */}
      <div className="relative flex-1 flex overflow-hidden">
        <textarea
          ref={textareaRef}
          aria-label="Markdown Input"
          placeholder="Type or paste your Markdown here... Use toolbar buttons above to format."
          value={content}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="w-full h-full p-4 font-mono text-sm text-[#171C29] bg-[#FFFFFF] resize-none focus:outline-none focus:ring-1 focus:ring-brand-blue leading-relaxed selection:bg-blue-100"
          spellCheck={false}
        />
      </div>

      {/* Footer Status Bar */}
      <div className="bg-[#F2F5FA] border-t border-[#E3E8F0] px-4 py-2 flex items-center justify-between text-xs text-[#707A8C]">
        <div className="flex items-center space-x-2">
          {isOverSizeLimit ? (
            <span className="flex items-center text-brand-error font-medium">
              <AlertTriangle className="w-3.5 h-3.5 mr-1" />
              Document exceeds 5MB limit ({formatBytes(byteSize)})
            </span>
          ) : isNearLimit ? (
            <span className="flex items-center text-brand-warning font-medium">
              <AlertTriangle className="w-3.5 h-3.5 mr-1" />
              Approaching 5MB limit ({formatBytes(byteSize)} / 5MB)
            </span>
          ) : (
            <span>Size: {formatBytes(byteSize)} / 5 MB</span>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <span>Encoding: UTF-8</span>
          <span>Markdown (CommonMark + GFM)</span>
        </div>
      </div>
    </div>
  );
});

export default MarkdownEditorPane;
