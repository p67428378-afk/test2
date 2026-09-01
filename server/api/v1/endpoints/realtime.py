from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from server.services.realtime_service import manager

router = APIRouter(tags=["Realtime Telemetry"])


@router.websocket("/parking-spots/live-updates")
async def websocket_parking_updates(websocket: WebSocket):
    """WebSocket connection endpoint for streaming live parking telemetry and status events."""
    await manager.connect(websocket)
    try:
        while True:
            # Keep the connection open and receive potential client heartbeats/messages
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)


@router.websocket("/realtime/live-updates")
async def websocket_realtime_updates(websocket: WebSocket):
    """Alias WebSocket connection endpoint."""
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)
