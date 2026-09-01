from typing import Optional, List, Dict, Any
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from server.services.realtime_service import manager

router = APIRouter()


@router.websocket("/live-updates")
async def websocket_endpoint(
    websocket: WebSocket,
    lat: Optional[float] = Query(None),
    lng: Optional[float] = Query(None),
    radius_km: Optional[float] = Query(None),
):
    """
    WebSocket endpoint for streaming real-time parking spot availability transitions.
    """
    await manager.connect(websocket)
    try:
        # Send initial connection acknowledgment
        await websocket.send_json(
            {
                "event": "CONNECTED",
                "message": "Connected to ParkFind real-time sensor stream",
                "timestamp": "now",
            }
        )

        while True:
            # Keep connection alive and listen for client ping/messages
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)


@router.get("/events/recent")
def get_recent_realtime_events(
    limit: int = Query(20, ge=1, le=50),
) -> List[Dict[str, Any]]:
    """Get the recent list of real-time spot transition events."""
    return manager.get_recent_events(limit=limit)
