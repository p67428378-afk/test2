import React from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Code,
  SquareCode,
  Link2,
  Image,
  Table,
  Minus,
  Sparkles,
} from "lucide-react";

export default function FormattingToolbar({ onFormat }) {
  const tools = [
    {
      group: "headings",
      items: [
        {
          id: "h1",
          label: "Heading 1",
          icon: Heading1,
          prefix: "# ",
          suffix: "",
          placeholder: "Heading 1",
          block: true,
        },
        {
          id: "h2",
          label: "Heading 2",
          icon: Heading2,
          prefix: "## ",
          suffix: "",
          placeholder: "Heading 2",
          block: true,
        },
        {
          id: "h3",
          label: "Heading 3",
          icon: Heading3,
          prefix: "### ",
          suffix: "",
          placeholder: "Heading 3",
          block: true,
        },
      ],
    },
    {
      group: "inline",
      items: [
        {
          id: "bold",
          label: "Bold (Ctrl+B)",
          icon: Bold,
          prefix: "**",
          suffix: "**",
          placeholder: "Bold Text",
        },
        {
          id: "italic",
          label: "Italic (Ctrl+I)",
          icon: Italic,
          prefix: "*",
          suffix: "*",
          placeholder: "Italic Text",
        },
        {
          id: "strike",
          label: "Strikethrough",
          icon: Strikethrough,
          prefix: "~~",
          suffix: "~~",
          placeholder: "Strikethrough Text",
        },
      ],
    },
    {
      group: "lists",
      items: [
        {
          id: "ul",
          label: "Bulleted List",
          icon: List,
          prefix: "- ",
          suffix: "",
          placeholder: "List item",
          block: true,
        },
        {
          id: "ol",
          label: "Numbered List",
          icon: ListOrdered,
          prefix: "1. ",
          suffix: "",
          placeholder: "Numbered item",
          block: true,
        },
        {
          id: "task",
          label: "Task List",
          icon: ListTodo,
          prefix: "- [ ] ",
          suffix: "",
          placeholder: "Task item",
          block: true,
        },
      ],
    },
    {
      group: "code-quote",
      items: [
        {
          id: "quote",
          label: "Quote",
          icon: Quote,
          prefix: "> ",
          suffix: "",
          placeholder: "Quote text",
          block: true,
        },
        {
          id: "code-inline",
          label: "Inline Code",
          icon: Code,
          prefix: "`",
          suffix: "`",
          placeholder: "code",
        },
        {
          id: "code-block",
          label: "Code Block",
          icon: SquareCode,
          prefix: "```javascript\n",
          suffix: "\n```",
          placeholder: 'console.log("Hello, World!");',
          block: true,
        },
      ],
    },
    {
      group: "insert",
      items: [
        {
          id: "link",
          label: "Insert Link",
          icon: Link2,
          prefix: "[",
          suffix: "](https://example.com)",
          placeholder: "Link text",
        },
        {
          id: "image",
          label: "Insert Image",
          icon: Image,
          prefix: "![",
          suffix:
            "](https://images.unsplash.com/photo-1542838132-92c53300491e?w=600)",
          placeholder: "Alt text",
        },
        {
          id: "table",
          label: "Insert Table",
          icon: Table,
          prefix:
            "| Feature | Status | Notes |\n|---|---|---|\n| Fast Preview | Supported | Real-time |\n| XSS Protection | Active | DOMPurify |\n",
          suffix: "",
          placeholder: "",
          raw: true,
        },
        {
          id: "hr",
          label: "Horizontal Rule",
          icon: Minus,
          prefix: "\n---\n\n",
          suffix: "",
          placeholder: "",
          raw: true,
        },
      ],
    },
  ];

  return (
    <div className="bg-gray-50/80 border-b border-gray-200 px-4 py-1.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mr-1 select-none hidden md:inline">
        Format
      </span>

      {tools.map((group, groupIdx) => (
        <React.Fragment key={group.group}>
          {groupIdx > 0 && <div className="h-4 w-px bg-gray-200 mx-0.5" />}
          <div className="flex items-center space-x-0.5">
            {group.items.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => onFormat(tool)}
                  title={tool.label}
                  aria-label={tool.label}
                  className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-xs rounded-md border border-transparent hover:border-gray-200 transition text-xs flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
