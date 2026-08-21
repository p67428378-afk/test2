import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

export default function MessageInput({ onSendMessage, isStreaming }) {
  const [content, setContent] = useState("");
  const textareaRef = useRef(null);

  // Auto-grow textarea height up to 200px
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    textarea.style.height = `${Math.min(scrollHeight, 200)}px`;
  }, [content]);

  const handleSend = () => {
    if (!content.trim() || isStreaming) return;
    onSendMessage(content);
    setContent("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isDisabled = !content.trim() || isStreaming;

  return (
    <div className="bg-[#1f293b] border border-[#334054] rounded-xl p-2 flex items-end gap-2 shadow-lg focus-within:border-[#6173f5] transition-colors">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message ChatGPT..."
        rows={1}
        className="flex-1 bg-transparent border-0 outline-none resize-none py-2 px-3 text-sm text-[#f7fafc] placeholder-[#94a3b8] max-h-[200px] overflow-y-auto"
        style={{ height: "38px" }}
      />
      <button
        onClick={handleSend}
        disabled={isDisabled}
        className={`p-2 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
          isDisabled
            ? "bg-transparent text-[#334054] cursor-not-allowed"
            : "bg-[#6173f5] text-white hover:bg-[#4f5fd8]"
        }`}
        title="Send Message"
      >
        <Send size={16} />
      </button>
    </div>
  );
}
