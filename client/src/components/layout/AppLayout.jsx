import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar.jsx";
import MainArea from "../chat/MainArea.jsx";
import RenameModal from "../common/RenameModal.jsx";
import { chatService } from "../../services/api.js";

export default function AppLayout() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [chatToRename, setChatToRename] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);

  // Fetch all chats on mount
  useEffect(() => {
    fetchChats();
  }, []);

  // Fetch messages when active chat changes
  useEffect(() => {
    if (activeChatId) {
      fetchMessages(activeChatId);
    } else {
      setMessages([]);
    }
    setError(null);
  }, [activeChatId]);

  const fetchChats = async () => {
    try {
      const data = await chatService.listChats();
      setChats(data);
      // If there are chats and no active chat is set, set the first one as active
      if (data.length > 0 && !activeChatId) {
        setActiveChatId(data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch chats:", err);
      setError("Failed to load chat sessions.");
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const data = await chatService.getMessages(chatId);
      setMessages(data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      setError("Failed to load messages.");
    }
  };

  const handleNewChat = async () => {
    try {
      const newChat = await chatService.createChat("New Chat");
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newChat.id);
    } catch (err) {
      console.error("Failed to create new chat:", err);
      setError("Failed to create a new chat session.");
    }
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this chat session?"))
      return;

    try {
      await chatService.deleteChat(chatId);
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      if (activeChatId === chatId) {
        const remaining = chats.filter((c) => c.id !== chatId);
        if (remaining.length > 0) {
          setActiveChatId(remaining[0].id);
        } else {
          setActiveChatId(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete chat:", err);
      setError("Failed to delete chat session.");
    }
  };

  const handleOpenRenameModal = (chat, e) => {
    e.stopPropagation();
    setChatToRename(chat);
    setIsRenameModalOpen(true);
  };

  const handleRenameChat = async (newTitle) => {
    if (!chatToRename) return;
    try {
      const updated = await chatService.renameChat(chatToRename.id, newTitle);
      setChats((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setIsRenameModalOpen(false);
      setChatToRename(null);
    } catch (err) {
      console.error("Failed to rename chat:", err);
      setError("Failed to rename chat session.");
    }
  };

  const handleSendMessage = async (content) => {
    if (!content.trim()) return;

    let currentChatId = activeChatId;

    // If no active chat, create one first
    if (!currentChatId) {
      try {
        const newChat = await chatService.createChat("New Chat");
        setChats((prev) => [newChat, ...prev]);
        setActiveChatId(newChat.id);
        currentChatId = newChat.id;
      } catch (err) {
        console.error("Failed to create chat for message:", err);
        setError("Failed to start a new chat session.");
        return;
      }
    }

    // Add user message locally
    const userMsg = {
      id: `temp-user-${Date.now()}`,
      chat_id: currentChatId,
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // Add placeholder AI message
    const aiMsgId = `temp-ai-${Date.now()}`;
    const aiMsg = {
      id: aiMsgId,
      chat_id: currentChatId,
      role: "assistant",
      content: "",
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, aiMsg]);

    setIsStreaming(true);
    setError(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      await chatService.streamMessage(currentChatId, content, {
        onChunk: (chunk) => {
          setMessages((prev) =>
            prev.map((m) => {
              if (m.id === aiMsgId) {
                return { ...m, content: m.content + chunk };
              }
              return m;
            }),
          );
        },
        onDone: (finalId) => {
          setMessages((prev) =>
            prev.map((m) => {
              if (m.id === aiMsgId) {
                return { ...m, id: finalId };
              }
              return m;
            }),
          );
          setIsStreaming(false);
          fetchChats(); // Refresh chat list to update titles/timestamps
        },
        onError: (err) => {
          setError("An error occurred while streaming the response.");
          setIsStreaming(false);
        },
        signal: controller.signal,
      });
    } catch (err) {
      console.error("Streaming failed:", err);
      setError("Failed to get response from AI.");
      setIsStreaming(false);
    }
  };

  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      fetchChats(); // Refresh chat list to save partial response
    }
  };

  return (
    <div className="flex h-screen bg-[#0f1729] text-[#f7fafc] overflow-hidden font-sans">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onOpenRenameModal={handleOpenRenameModal}
      />

      <MainArea
        messages={messages}
        isStreaming={isStreaming}
        onSendMessage={handleSendMessage}
        onStopGenerating={handleStopGenerating}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        error={error}
      />

      {isRenameModalOpen && (
        <RenameModal
          chat={chatToRename}
          onClose={() => {
            setIsRenameModalOpen(false);
            setChatToRename(null);
          }}
          onSave={handleRenameChat}
        />
      )}
    </div>
  );
}
