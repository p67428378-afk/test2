import React from "react";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  SquareCode,
  Link as LinkIcon,
  Table as TableIcon,
  Minus,
} from "lucide-react";

export default function FormattingToolbar({ onApplyFormat }) {
  const tools = [
    {
      id: "bold",
      label: "Bold",
      icon: Bold,
      action: () =>
        onApplyFormat({
          type: "wrap",
          prefix: "**",
          suffix: "**",
          placeholder: "bold text",
        }),
      shortcut: "Ctrl+B",
    },
    {
      id: "italic",
      label: "Italic",
      icon: Italic,
      action: () =>
        onApplyFormat({
          type: "wrap",
          prefix: "*",
          suffix: "*",
          placeholder: "italic text",
        }),
      shortcut: "Ctrl+I",
    },
    { id: "divider-1", isDivider: true },
    {
      id: "h1",
      label: "Heading 1",
      icon: Heading1,
      action: () =>
        onApplyFormat({
          type: "line-prefix",
          prefix: "# ",
          placeholder: "Heading 1",
        }),
    },
    {
      id: "h2",
      label: "Heading 2",
      icon: Heading2,
      action: () =>
        onApplyFormat({
          type: "line-prefix",
          prefix: "## ",
          placeholder: "Heading 2",
        }),
    },
    {
      id: "h3",
      label: "Heading 3",
      icon: Heading3,
      action: () =>
        onApplyFormat({
          type: "line-prefix",
          prefix: "### ",
          placeholder: "Heading 3",
        }),
    },
    { id: "divider-2", isDivider: true },
    {
      id: "unordered-list",
      label: "Unordered List",
      icon: List,
      action: () =>
        onApplyFormat({
          type: "line-prefix",
          prefix: "- ",
          placeholder: "List item",
        }),
    },
    {
      id: "ordered-list",
      label: "Ordered List",
      icon: ListOrdered,
      action: () =>
        onApplyFormat({
          type: "line-prefix",
          prefix: "1. ",
          placeholder: "List item",
        }),
    },
    {
      id: "quote",
      label: "Blockquote",
      icon: Quote,
      action: () =>
        onApplyFormat({
          type: "line-prefix",
          prefix: "> ",
          placeholder: "Quote",
        }),
    },
    { id: "divider-3", isDivider: true },
    {
      id: "inline-code",
      label: "Inline Code",
      icon: Code,
      action: () =>
        onApplyFormat({
          type: "wrap",
          prefix: "`",
          suffix: "`",
          placeholder: "code",
        }),
    },
    {
      id: "code-block",
      label: "Code Block",
      icon: SquareCode,
      action: () =>
        onApplyFormat({
          type: "block",
          prefix: "```javascript\n",
          suffix: "\n```",
          placeholder: "// Write code here",
        }),
    },
    {
      id: "link",
      label: "Insert Link",
      icon: LinkIcon,
      action: () =>
        onApplyFormat({
          type: "link",
          prefix: "[",
          suffix: "](https://example.com)",
          placeholder: "link text",
        }),
    },
    {
      id: "table",
      label: "Insert Table",
      icon: TableIcon,
      action: () =>
        onApplyFormat({
          type: "insert",
          text: "\n| Header 1 | Header 2 | Header 3 |\n| :--- | :--- | :--- |\n| Row 1 Col 1 | Row 1 Col 2 | Row 1 Col 3 |\n| Row 2 Col 1 | Row 2 Col 2 | Row 2 Col 3 |\n",
        }),
    },
    {
      id: "hr",
      label: "Horizontal Rule",
      icon: Minus,
      action: () => onApplyFormat({ type: "insert", text: "\n---\n" }),
    },
  ];

  return (
    <div
      role="toolbar"
      aria-label="Markdown formatting toolbar"
      className="flex flex-wrap items-center gap-1 bg-[#F2F5FA] border border-[#E3E8F0] rounded-t-lg p-2 text-[#171C29]"
    >
      {tools.map((tool) => {
        if (tool.isDivider) {
          return (
            <div key={tool.id} className="w-[1px] h-6 bg-[#E3E8F0] mx-1" />
          );
        }

        const IconComponent = tool.icon;
        return (
          <button
            key={tool.id}
            type="button"
            title={
              tool.shortcut ? `${tool.label} (${tool.shortcut})` : tool.label
            }
            aria-label={tool.label}
            onClick={tool.action}
            className="p-1.5 rounded hover:bg-white hover:text-brand-blue hover:shadow-sm text-[#707A8C] transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-1"
          >
            <IconComponent className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}
