import React, { useState, useEffect, useRef } from "react";
import { Send, X, User, Shield, Loader2 } from "lucide-react";

export default function ChatWindow({
  claimId,
  messages,
  onSendMessage,
  onClose,
  isLoading,
}) {
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);
  const currentUserId = localStorage.getItem("user_email") || "User";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText("");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-[500px] max-w-md w-full fixed bottom-6 right-6 z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-[#2a313d] text-white p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#c3c0ff]" />
          <div>
            <h3 className="font-bold text-sm">Anonymous Verification Chat</h3>
            <p className="text-[10px] text-gray-300">
              Claim ID: {claimId.substring(0, 8)}...
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 text-xs py-8">
            No messages yet. Start the conversation to verify ownership.
          </div>
        ) : (
          messages.map((msg) => {
            // Since it's anonymous, we can show "Claimant" or "Admin/Verifier"
            const isMe = msg.sender_id === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 text-sm ${
                    isMe
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  }`}
                >
                  <p className="break-words">{msg.text}</p>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-gray-200 flex gap-2 bg-white shrink-0"
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 bg-gray-50 border border-gray-300 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="p-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
