import React, { useEffect, useRef } from "react";

export default function MarkdownEditorTextarea({
  value,
  onChange,
  textareaRef,
  onKeyDown,
}) {
  const localRef = useRef(null);
  const activeRef = textareaRef || localRef;

  const handleKeyDown = (e) => {
    // Tab key indent
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newValue = value.substring(0, start) + "  " + value.substring(end);
      onChange(newValue);

      // Restore cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
      return;
    }

    // Pass up for custom shortcuts (e.g., Ctrl+B, Ctrl+I)
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      <div className="bg-gray-50/50 border-b border-gray-100 px-4 py-1.5 flex items-center justify-between text-xs text-gray-500 font-mono">
        <span className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <span>MARKDOWN SOURCE</span>
        </span>
        <span className="text-[11px] text-gray-400">
          Standard CommonMark / GFM
        </span>
      </div>

      <div className="flex-1 relative flex">
        <textarea
          ref={activeRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="# Start writing your Markdown here...&#10;&#10;Use the toolbar above or write Markdown directly.&#10;&#10;- **Bold** formatting&#10;- *Italic* text&#10;- `Inline code` and code blocks&#10;- [Links](https://example.com)&#10;- Tables and blockquotes"
          aria-label="Markdown Input"
          spellCheck="false"
          className="w-full h-full p-4 sm:p-6 font-mono text-sm leading-relaxed text-gray-900 bg-transparent resize-none focus:outline-none focus:ring-0 border-0 selection:bg-blue-100 placeholder-gray-400 overflow-y-auto"
        />
      </div>
    </div>
  );
}
