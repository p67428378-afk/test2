from typing import List, Dict, Any
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from server.services.realtime_service import realtime_manager

router = APIRouter(prefix="/realtime", tags=["Realtime"])


@router.get("/history", summary="Get recent realtime events")
def get_realtime_history(limit: int = 20) -> List[Dict[str, Any]]:
    return realtime_manager.get_recent_history(limit=limit)


@router.websocket("/updates")
async def realtime_updates_ws(websocket: WebSocket):
    await realtime_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f'{{"received": "{data}"}}')
    except WebSocketDisconnect:
        realtime_manager.disconnect(websocket)
