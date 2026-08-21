import React from "react";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  // Simple helper to render text with basic markdown code blocks and newlines
  const renderContent = (text) => {
    if (!text) return null;

    // Split by code blocks ```
    const parts = text.split(/(```[a-z]*\n[\s\S]*?\n```)/g);

    return parts.map((part, index) => {
      if (part.startsWith("```")) {
        // Extract language and code
        const lines = part.split("\n");
        const code = lines.slice(1, -1).join("\n");
        return (
          <pre
            key={index}
            className="bg-[#141c2b] border border-[#334054] p-4 rounded-lg overflow-x-auto my-2 font-mono text-xs text-[#f7fafc] max-w-full"
          >
            <code>{code}</code>
          </pre>
        );
      }

      // Handle inline code `code`
      const inlineParts = part.split(/(`[^`\n]+`)/g);
      const renderedInline = inlineParts.map((subPart, subIndex) => {
        if (subPart.startsWith("`") && subPart.endsWith("`")) {
          return (
            <code
              key={subIndex}
              className="bg-[#141c2b] px-1.5 py-0.5 rounded font-mono text-xs text-[#6173f5]"
            >
              {subPart.slice(1, -1)}
            </code>
          );
        }
        return subPart;
      });

      // Preserve newlines
      return (
        <p
          key={index}
          className="whitespace-pre-wrap leading-relaxed mb-2 last:mb-0"
        >
          {renderedInline}
        </p>
      );
    });
  };

  return (
    <div
      className={`flex gap-4 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${
          isUser ? "bg-[#6173f5]" : "bg-[#1f293b] border border-[#334054]"
        }`}
      >
        {isUser ? "JD" : "AI"}
      </div>

      {/* Bubble */}
      <div
        className={`p-4 rounded-2xl border ${
          isUser
            ? "bg-[#141c2b] border-[#334054] rounded-tr-none text-[#f7fafc]"
            : "bg-[#1f293b] border-[#334054] rounded-tl-none text-[#f7fafc]"
        }`}
      >
        <div className="text-sm">{renderContent(message.content)}</div>
      </div>
    </div>
  );
}
