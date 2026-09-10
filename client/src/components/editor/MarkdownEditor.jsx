import React, { useState } from "react";
import { Edit3, Eye, Bold, Italic, Code, List, Quote } from "lucide-react";

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your technical research note content in Markdown...",
}) {
  const [activeTab, setActiveTab] = useState("write");

  const insertFormatting = (prefix, suffix = "") => {
    const textarea = document.getElementById("markdown-textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || "text";
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newValue =
      value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length,
      );
    }, 0);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center space-x-1 bg-slate-200 p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center space-x-1 transition ${
              activeTab === "write"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center space-x-1 transition ${
              activeTab === "preview"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Preview</span>
          </button>
        </div>

        {activeTab === "write" && (
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => insertFormatting("**", "**")}
              title="Bold"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded"
            >
              <Bold className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("*", "*")}
              title="Italic"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded"
            >
              <Italic className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("`", "`")}
              title="Inline Code"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded"
            >
              <Code className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("- ")}
              title="Unordered List"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded"
            >
              <List className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("> ")}
              title="Blockquote"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded"
            >
              <Quote className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {activeTab === "write" ? (
        <textarea
          id="markdown-textarea"
          rows={12}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-4 text-sm font-mono text-slate-900 border-none focus:outline-none resize-y min-h-[250px]"
        />
      ) : (
        <div className="p-4 min-h-[250px] prose prose-slate max-w-none text-sm leading-relaxed bg-slate-50/50">
          {value ? (
            <div className="whitespace-pre-wrap font-sans text-slate-800">
              {value}
            </div>
          ) : (
            <p className="text-slate-400 italic text-xs">
              Nothing to preview yet. Switch back to Write mode to add content.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default MarkdownEditor;
