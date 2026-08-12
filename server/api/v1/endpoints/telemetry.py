from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server import crud, schemas
from server.database import get_db
from server.services.websocket_manager import manager

router = APIRouter()


@router.post("/telemetry/location", response_model=schemas.TrainResponse)
async def post_telemetry_location(
    payload: schemas.TelemetryPayload,
    db: Session = Depends(get_db),
):
    """Internal/Ingestion endpoint for posting GPS updates."""
    try:
        updated_train = crud.process_telemetry_location(db, payload)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid telemetry payload: {str(e)}",
        )

    # Broadcast updated train telemetry over WebSocket
    broadcast_data = {
        "event": "location_update",
        "train_id": updated_train.id,
        "train_number": updated_train.train_number,
        "latitude": updated_train.latitude,
        "longitude": updated_train.longitude,
        "speed": updated_train.speed,
        "heading": updated_train.heading,
        "status": updated_train.status,
        "last_telemetry_at": updated_train.last_telemetry_at.isoformat()
        if updated_train.last_telemetry_at
        else None,
    }
    await manager.broadcast(broadcast_data)

    return updated_train
