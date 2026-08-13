export class WebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = new Set();
    this.reconnectTimer = null;
  }

  connect(token) {
    if (!token) return;
    if (
      this.ws &&
      (this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    const baseUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    const wsUrl = baseUrl.replace(/^http/, "ws") + `/api/v1/ws?token=${token}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log("WebSocket Connected");
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.notifyListeners(data);
        } catch (err) {
          console.error("Failed to parse WS message:", err);
        }
      };

      this.ws.onclose = () => {
        console.log("WebSocket Disconnected");
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };
    } catch (err) {
      console.error("WebSocket connection error:", err);
    }
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(data) {
    this.listeners.forEach((callback) => {
      try {
        callback(data);
      } catch (e) {
        console.error("Error in WS listener callback:", e);
      }
    });
  }
}

export const wsService = new WebSocketService();
