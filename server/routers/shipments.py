from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server import schemas, crud, auth, models

router = APIRouter()


@router.post(
    "", response_model=schemas.ShipmentResponse, status_code=status.HTTP_201_CREATED
)
def create_shipment(
    shipment_in: schemas.ShipmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    shipment = crud.create_shipment(db, shipment_in, current_user.id)
    db.commit()
    db.refresh(shipment)
    return shipment


@router.get("", response_model=schemas.ShipmentListResponse)
def list_shipments(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    shipments = crud.get_user_shipments(db, current_user.id, skip=skip, limit=limit)
    items = []
    for s in shipments:
        items.append(
            schemas.ShipmentListItem(
                id=s.id,
                tracking_id=s.tracking_id,
                recipient_name=s.recipient_details.get("name", ""),
                destination_city=s.recipient_details.get("city", ""),
                status=s.status,
                created_at=s.created_at,
            )
        )
    return schemas.ShipmentListResponse(items=items)


@router.get("/{tracking_id}", response_model=schemas.ShipmentTrackResponse)
def track_shipment(tracking_id: str, db: Session = Depends(get_db)):
    shipment = crud.get_shipment_by_tracking_id(db, tracking_id)
    if not shipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shipment with specified tracking ID not found",
        )

    history_items = []
    # Sort tracking history by timestamp ascending
    sorted_history = sorted(shipment.tracking_history, key=lambda x: x.timestamp)
    for h in sorted_history:
        history_items.append(
            schemas.TrackingHistoryItem(
                id=h.id,
                status=h.status,
                location=h.location,
                notes=h.notes,
                timestamp=h.timestamp,
            )
        )

    return schemas.ShipmentTrackResponse(
        id=shipment.id,
        tracking_id=shipment.tracking_id,
        sender_name=shipment.sender_details.get("name", ""),
        recipient_name=shipment.recipient_details.get("name", ""),
        destination_city=shipment.recipient_details.get("city", ""),
        status=shipment.status,
        tracking_history=history_items,
    )
