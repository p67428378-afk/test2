import React from "react";
import { Menu, Settings, Square, AlertCircle } from "lucide-react";
import MessageHistory from "./MessageHistory.jsx";
import MessageInput from "./MessageInput.jsx";

export default function MainArea({
  messages,
  isStreaming,
  onSendMessage,
  onStopGenerating,
  isSidebarOpen,
  setIsSidebarOpen,
  error,
}) {
  const suggestedPrompts = [
    {
      text: "💡 Explain quantum computing in simple terms",
      value: "Explain quantum computing in simple terms",
    },
    {
      text: "📝 Write a Python script for a REST API",
      value: "Write a Python script for a REST API",
    },
    {
      text: "🎨 Design a database schema for a chat app",
      value: "Design a database schema for a chat app",
    },
    {
      text: "🚀 Help me brainstorm names for my startup",
      value: "Help me brainstorm names for my startup",
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0f1729] relative overflow-hidden">
      {/* Main Header */}
      <header className="h-16 border-b border-[#334054] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-[#1f293b] text-[#94a3b8] hover:text-white transition-colors"
              title="Open Sidebar"
            >
              <Menu size={20} />
            </button>
          )}
          {isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-[#1f293b] text-[#94a3b8] hover:text-white transition-colors md:block hidden"
              title="Collapse Sidebar"
            >
              <Menu size={20} />
            </button>
          )}
          <span className="font-bold text-[#f7fafc] text-base">GPT-4o</span>
        </div>
        <button className="flex items-center gap-2 text-sm text-[#94a3b8] hover:text-white transition-colors p-2 rounded-lg hover:bg-[#1f293b]">
          <Settings size={16} />
          <span>Settings</span>
        </button>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-950/50 border-b border-red-500/30 px-6 py-3 flex items-center gap-3 text-red-200 text-sm shrink-0">
          <AlertCircle size={16} className="text-red-400 shrink-0" />
          <span className="flex-1">{error}</span>
        </div>
      )}

      {/* Chat Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
        {messages.length === 0 ? (
          /* Welcome Landing Page */
          <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-3xl mx-auto w-full">
            <h2 className="text-3xl font-bold text-[#f7fafc] mb-8 text-center">
              How can I help you today?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(prompt.value)}
                  className="bg-[#1f293b] border border-[#334054] hover:border-[#6173f5] text-left p-4 rounded-xl text-sm text-[#f7fafc] hover:bg-[#2d3748] transition-all duration-200"
                >
                  {prompt.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Message History */
          <MessageHistory messages={messages} isStreaming={isStreaming} />
        )}
      </div>

      {/* Stop Generating Button */}
      {isStreaming && (
        <div className="flex justify-center mb-2 shrink-0">
          <button
            onClick={onStopGenerating}
            className="bg-[#1f293b] border border-[#334054] hover:bg-[#2d3748] text-[#f7fafc] font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors text-sm shadow-lg"
          >
            <Square size={14} className="fill-current" />
            <span>Stop Generating</span>
          </button>
        </div>
      )}

      {/* Message Input Area */}
      <div className="p-6 max-w-3xl mx-auto w-full shrink-0">
        <MessageInput onSendMessage={onSendMessage} isStreaming={isStreaming} />
        <p className="text-center text-[11px] text-[#94a3b8] mt-3">
          ChatGPT can make mistakes. Verify important info.
        </p>
      </div>
    </div>
  );
}
