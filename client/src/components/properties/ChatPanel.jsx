import React, { useState, useEffect, useRef } from "react";
import { messageService } from "../../services/api";

export default function ChatPanel({ user }) {
  const [messages, setMessages] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await messageService.list();
      setMessages(data);

      // Group messages by property_id + sender/receiver pair to form threads
      const threads = groupMessagesIntoThreads(data, user);
      if (threads.length > 0 && !selectedThread) {
        setSelectedThread(threads[0]);
      } else if (selectedThread) {
        // Update active thread with new messages
        const updatedThread = threads.find((t) => t.id === selectedThread.id);
        if (updatedThread) {
          setSelectedThread(updatedThread);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 10000); // Poll every 10s
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedThread]);

  const groupMessagesIntoThreads = (msgList, currentUser) => {
    const threadsMap = {};

    msgList.forEach((msg) => {
      // Determine the other party in the conversation
      const otherPartyId =
        msg.sender_id === currentUser.id ? msg.receiver_id : msg.sender_id;
      const otherPartyName =
        msg.sender_id === currentUser.id ? msg.receiver_name : msg.sender_name;

      // Thread key is property_id + otherPartyId
      const threadKey = `${msg.property_id}_${otherPartyId}`;

      if (!threadsMap[threadKey]) {
        threadsMap[threadKey] = {
          id: threadKey,
          propertyId: msg.property_id,
          propertyAddress: msg.property_address,
          otherPartyId,
          otherPartyName,
          messages: [],
        };
      }
      threadsMap[threadKey].messages.push(msg);
    });

    // Sort messages in each thread by timestamp ascending
    return Object.values(threadsMap)
      .map((thread) => {
        thread.messages.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
        );
        // Latest message first for sorting threads list
        thread.latestTimestamp = new Date(
          thread.messages[thread.messages.length - 1].timestamp,
        );
        return thread;
      })
      .sort((a, b) => b.latestTimestamp - a.latestTimestamp);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || !selectedThread) return;

    try {
      await messageService.send({
        content: replyContent,
        property_id: selectedThread.propertyId,
        receiver_id: selectedThread.otherPartyId,
      });
      setReplyContent("");
      await fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const threads = groupMessagesIntoThreads(messages, user);

  if (loading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-[#bbcabf]">
        <span className="material-symbols-outlined animate-spin mr-2">
          sync
        </span>
        Loading messages...
      </div>
    );
  }

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden grid grid-cols-12 h-[600px]">
      {/* Threads List (4/12) */}
      <div className="col-span-4 border-r border-[#334155] flex flex-col h-full">
        <div className="p-4 border-b border-[#334155] bg-[#1E293B]">
          <h3 className="font-semibold text-white">Conversations</h3>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-[#334155]/50">
          {threads.length === 0 ? (
            <div className="p-4 text-center text-xs text-[#bbcabf]">
              No messages yet.
            </div>
          ) : (
            threads.map((thread) => {
              const isSelected = selectedThread?.id === thread.id;
              const lastMsg = thread.messages[thread.messages.length - 1];
              return (
                <button
                  key={thread.id}
                  onClick={() => setSelectedThread(thread)}
                  className={`w-full text-left p-4 transition-colors flex flex-col gap-1 ${
                    isSelected
                      ? "bg-[#10B981]/10 border-l-4 border-[#4edea3]"
                      : "hover:bg-[#0F172A]/30"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-sm text-white truncate max-w-[120px]">
                      {thread.otherPartyName}
                    </span>
                    <span className="text-[10px] text-[#bbcabf]">
                      {new Date(lastMsg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <span className="text-xs text-[#4edea3] truncate">
                    {thread.propertyAddress}
                  </span>
                  <p className="text-xs text-[#bbcabf] truncate">
                    {lastMsg.content}
                  </p>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Window (8/12) */}
      <div className="col-span-8 flex flex-col h-full bg-[#0F172A]/30">
        {selectedThread ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-[#334155] bg-[#1E293B] flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-white">
                  {selectedThread.otherPartyName}
                </h4>
                <p className="text-xs text-[#4edea3]">
                  {selectedThread.propertyAddress}
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {selectedThread.messages.map((msg) => {
                const isMe = msg.sender_id === user.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[70%] ${isMe ? "self-end items-end" : "self-start items-start"}`}
                  >
                    <div
                      className={`p-3 rounded-xl text-sm ${
                        isMe
                          ? "bg-[#10b981] text-[#0F172A] rounded-tr-none"
                          : "bg-[#2d3449] text-white rounded-tl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-[#bbcabf] mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Form */}
            <form
              onSubmit={handleSendReply}
              className="p-4 border-t border-[#334155] bg-[#1E293B] flex gap-2"
            >
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] outline-none"
              />
              <button
                type="submit"
                className="bg-[#10b981] text-[#0F172A] px-4 py-2 rounded-lg font-semibold hover:bg-[#4edea3] transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[20px]">
                  send
                </span>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[#bbcabf] gap-2">
            <span className="material-symbols-outlined text-4xl">chat</span>
            <p className="text-sm">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
