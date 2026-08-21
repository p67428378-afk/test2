import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";

export default function MessageHistory({ messages, isStreaming }) {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom on new messages or streaming updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 max-w-3xl mx-auto w-full">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {/* Streaming indicator */}
      {isStreaming && messages[messages.length - 1]?.role === "user" && (
        <div className="flex gap-4 items-start p-3 bg-[#1f293b] border border-[#334054] rounded-xl max-w-[85%] mr-auto">
          <div className="w-8 h-8 rounded-full bg-[#6173f5] flex items-center justify-center text-white font-bold text-xs shrink-0">
            AI
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-1 items-center text-sm text-[#94a3b8]">
              <span className="text-[#6173f5] animate-pulse">▌</span>
              <span>Streaming response...</span>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
