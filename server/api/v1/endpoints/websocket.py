import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from server import crud
from server.database import get_db
from server.services.websocket_manager import manager

logger = logging.getLogger(__name__)

router = APIRouter()


@router.websocket("/ws/trains/live")
async def websocket_live_trains(websocket: WebSocket):
    await manager.connect(websocket)
    db = next(get_db())
    try:
        # Send initial list of active trains upon client connection
        trains = crud.get_trains(db)
        initial_data = {
            "event": "initial_state",
            "trains": [
                {
                    "train_id": t.id,
                    "train_number": t.train_number,
                    "latitude": t.latitude,
                    "longitude": t.longitude,
                    "speed": t.speed,
                    "heading": t.heading,
                    "status": t.status,
                    "last_telemetry_at": t.last_telemetry_at.isoformat()
                    if t.last_telemetry_at
                    else None,
                }
                for t in trains
            ],
        }
        await websocket.send_json(initial_data)

        # Keep connection open and listen for client messages / pings
        while True:
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)
    finally:
        db.close()
