import React from "react";
import { Plus, Trash2, Edit2, MessageSquare, User } from "lucide-react";

export default function Sidebar({
  chats,
  activeChatId,
  setActiveChatId,
  isOpen,
  setIsOpen,
  onNewChat,
  onDeleteChat,
  onOpenRenameModal,
}) {
  if (!isOpen) return null;

  return (
    <div className="w-80 bg-[#1f293b] border-r border-[#334054] flex flex-col h-full p-4 shrink-0 transition-all duration-300 ease-in-out">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-[#6173f5] flex items-center gap-2">
          <span>ChatGPT AI</span>
        </h1>
        <span className="text-xl">💬</span>
      </div>

      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="w-full bg-[#6173f5] hover:bg-[#4f5fd8] text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors mb-4"
      >
        <Plus size={18} />
        <span>New Chat</span>
      </button>

      <div className="h-px bg-[#334054] mb-4" />

      {/* Recent Chats Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-2 px-2">
          Recent Chats
        </p>

        {chats.length === 0 ? (
          <div className="flex items-center justify-center py-8 px-4 text-center">
            <p className="text-sm text-[#94a3b8]">No recent chats</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {chats.map((chat) => {
              const isActive = chat.id === activeChatId;
              return (
                <div
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                    isActive
                      ? "bg-[#6173f5] text-white"
                      : "hover:bg-[#334054] text-[#f7fafc]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <MessageSquare
                      size={16}
                      className={isActive ? "text-white" : "text-[#94a3b8]"}
                    />
                    <span className="text-sm font-medium truncate pr-2">
                      {chat.title || "New Chat"}
                    </span>
                  </div>

                  {/* Actions (Rename / Delete) */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={(e) => onOpenRenameModal(chat, e)}
                      className={`p-1 rounded hover:bg-black/10 transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-[#94a3b8] hover:text-white"
                      }`}
                      title="Rename Chat"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={(e) => onDeleteChat(chat.id, e)}
                      className={`p-1 rounded hover:bg-black/10 transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-[#94a3b8] hover:text-red-400"
                      }`}
                      title="Delete Chat"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className="mt-auto pt-4 border-t border-[#334054]">
        <div className="bg-[#141c2b] p-3 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#6173f5] flex items-center justify-center text-white font-bold text-sm shrink-0">
            JD
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#f7fafc] truncate">
              John Doe
            </p>
            <p className="text-xs text-[#94a3b8] truncate">
              john.doe@example.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
