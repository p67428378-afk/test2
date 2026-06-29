"""
Module: websocket
Purpose: WebSocket endpoint and connection manager for real-time bid updates and notifications.
"""

from typing import List, Dict
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, item_id: str, websocket: WebSocket):
        await websocket.accept()
        if item_id not in self.active_connections:
            self.active_connections[item_id] = []
        self.active_connections[item_id].append(websocket)

    def disconnect(self, item_id: str, websocket: WebSocket):
        if item_id in self.active_connections:
            if websocket in self.active_connections[item_id]:
                self.active_connections[item_id].remove(websocket)
            if not self.active_connections[item_id]:
                del self.active_connections[item_id]

    async def broadcast(self, item_id: str, message: dict):
        if item_id in self.active_connections:
            for connection in self.active_connections[item_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass


manager = ConnectionManager()


@router.websocket("/ws/items/{item_id}")
async def websocket_endpoint(websocket: WebSocket, item_id: str):
    await manager.connect(item_id, websocket)
    try:
        while True:
            # Keep connection alive and listen for any incoming messages if needed
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(item_id, websocket)


@router.get("/ws/items/{item_id}")
def websocket_info(item_id: str):
    """
    Info endpoint for the WebSocket connection.
    """
    return {"message": "Use WebSocket protocol (ws://) to connect to this endpoint."}
