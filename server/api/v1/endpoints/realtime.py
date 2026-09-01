from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from server.services.realtime_service import manager

router = APIRouter(tags=["realtime"])


@router.websocket("/api/v1/parking-spots/live-updates")
async def websocket_parking_updates(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep alive and receive any client messages/pings
            _ = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)
