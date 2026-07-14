from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict

router = APIRouter()


class ConnectionManager:
    def __init__(self):
        # Maps doctor_id (as string) to list of active WebSockets
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, doctor_id: str):
        await websocket.accept()
        if doctor_id not in self.active_connections:
            self.active_connections[doctor_id] = []
        self.active_connections[doctor_id].append(websocket)

    def disconnect(self, websocket: WebSocket, doctor_id: str):
        if doctor_id in self.active_connections:
            if websocket in self.active_connections[doctor_id]:
                self.active_connections[doctor_id].remove(websocket)
            if not self.active_connections[doctor_id]:
                del self.active_connections[doctor_id]

    async def broadcast_availability_change(self, doctor_id: str, message: dict):
        if doctor_id in self.active_connections:
            for connection in self.active_connections[doctor_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass


manager = ConnectionManager()


@router.websocket("/ws/availability/{doctor_id}")
async def websocket_endpoint(websocket: WebSocket, doctor_id: str):
    await manager.connect(websocket, doctor_id)
    try:
        while True:
            # Keep connection alive, receive any client messages if needed
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, doctor_id)
