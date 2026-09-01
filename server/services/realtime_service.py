import json
from datetime import datetime, timezone
from typing import List, Dict, Any
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.recent_events: List[Dict[str, Any]] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast_event(self, event_data: Dict[str, Any]):
        # Add timestamp if missing
        if "timestamp" not in event_data:
            event_data["timestamp"] = datetime.now(timezone.utc).isoformat()

        # Keep last 50 events in history
        self.recent_events.insert(0, event_data)
        if len(self.recent_events) > 50:
            self.recent_events = self.recent_events[:50]

        message_str = json.dumps(event_data)
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(message_str)
            except Exception:
                disconnected.append(connection)

        for dead_conn in disconnected:
            self.disconnect(dead_conn)

    def get_recent_events(self, limit: int = 20) -> List[Dict[str, Any]]:
        return self.recent_events[:limit]


manager = ConnectionManager()
