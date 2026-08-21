import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const chatService = {
  // Create a new chat session
  createChat: async (title = "New Chat") => {
    const response = await api.post("/api/v1/chats", { title });
    return response.data;
  },

  // List all chat sessions
  listChats: async (skip = 0, limit = 20) => {
    const response = await api.get(`/api/v1/chats?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Retrieve all messages for a session
  getMessages: async (chatId) => {
    const response = await api.get(`/api/v1/chats/${chatId}/messages`);
    return response.data;
  },

  // Delete a chat session
  deleteChat: async (chatId) => {
    const response = await api.delete(`/api/v1/chats/${chatId}`);
    return response.data;
  },

  // Rename a chat session title
  renameChat: async (chatId, title) => {
    const response = await api.patch(`/api/v1/chats/${chatId}`, { title });
    return response.data;
  },

  // Send a message and stream the response
  // onChunk: callback for each text chunk (string)
  // onDone: callback when streaming is complete (with final message_id)
  // onError: callback on error
  // signal: AbortSignal to allow stopping generation
  streamMessage: async (
    chatId,
    content,
    { onChunk, onDone, onError, signal },
  ) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/chats/${chatId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
          signal,
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");

        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          if (trimmed.startsWith("data: ")) {
            const jsonStr = trimmed.slice(6);
            try {
              const data = JSON.parse(jsonStr);
              if (data.done) {
                onDone(data.message_id);
              } else {
                onChunk(data.content);
              }
            } catch (e) {
              console.error("Error parsing SSE JSON:", e, jsonStr);
            }
          }
        }
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Stream aborted by user");
      } else {
        console.error("Stream error:", error);
        onError(error);
      }
    }
  },
};

export default api;
