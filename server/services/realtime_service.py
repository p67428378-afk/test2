import asyncio
import json
from collections import deque
from datetime import datetime, timezone
from typing import Any, Dict, List
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self._events: deque = deque(maxlen=100)

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: Dict[str, Any]):
        message_json = json.dumps(message)
        dead_connections = []
        for connection in self.active_connections:
            try:
                await connection.send_text(message_json)
            except Exception:
                dead_connections.append(connection)
        for dead in dead_connections:
            self.disconnect(dead)

    def record_event(self, event_data: Dict[str, Any]):
        if "timestamp" not in event_data:
            event_data["timestamp"] = datetime.now(timezone.utc).isoformat()
        if "event" not in event_data:
            event_data["event"] = "SPOT_STATUS_CHANGED"
        self._events.appendleft(event_data)

    def get_recent_events(self, limit: int = 20) -> List[Dict[str, Any]]:
        return list(self._events)[:limit]


manager = ConnectionManager()
