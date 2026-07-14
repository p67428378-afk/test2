import React, { useState, useEffect, useRef } from "react";
import { Send, MessageSquare } from "lucide-react";
import { bookingsService } from "../../services/api";

export default function ClientChatPanel({ bookingId, clientName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const data = await bookingsService.getMessages(bookingId);
      setMessages(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      setError("Could not load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId) {
      setLoading(true);
      fetchMessages();
      // Poll for new messages every 5 seconds
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [bookingId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const sentMsg = await bookingsService.sendMessage(bookingId, newMessage);
      setMessages((prev) => [...prev, sentMsg]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Failed to send message.");
    }
  };

  if (loading) {
    return (
      <div className="bg-surface-container border border-outline-variant rounded-xl p-6 flex flex-col items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-on-surface-variant mt-4">Loading conversation...</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl flex flex-col h-[500px] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-outline-variant bg-surface-container-high flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-semibold text-on-surface">{clientName}</h4>
          <p className="text-xs text-outline">Direct Expedition Channel</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-surface-container-lowest/30">
        {error && (
          <div className="p-3 bg-error/10 border border-error/20 text-error text-sm rounded-lg text-center">
            {error}
          </div>
        )}
        {messages.length === 0 ? (
          <div className="text-center text-on-surface-variant py-10">
            <p className="text-sm">No messages yet.</p>
            <p className="text-xs text-outline mt-1">
              Send a message to initiate coordination.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            // Determine if sender is guide or client
            // In this simplified app, if sender_id matches guide, it's "me"
            const guide = JSON.parse(localStorage.getItem("guide") || "{}");
            const isMe = msg.sender_id === guide.id;

            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-xl p-3 ${
                    isMe
                      ? "bg-primary text-on-primary-container rounded-tr-none"
                      : "bg-surface-container-high text-on-surface rounded-tl-none border border-outline-variant"
                  }`}
                >
                  <p className="text-body-md font-body-md break-words">
                    {msg.message_body}
                  </p>
                  <span
                    className={`text-[10px] block mt-1 text-right ${isMe ? "text-on-primary-container/70" : "text-outline"}`}
                  >
                    {new Date(msg.sent_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-outline-variant bg-surface-container-high flex gap-2"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
          className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 text-body-md font-body-md focus:outline-none focus:ring-2 focus:ring-primary transition-all text-on-surface"
        />
        <button
          type="submit"
          className="p-2 bg-primary text-on-primary-container rounded-lg hover:brightness-110 transition-all flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
