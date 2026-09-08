from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Delivery, User
from server.schemas import DeliveryCreate, DeliveryResponse

router = APIRouter(prefix="/api/v1/deliveries", tags=["deliveries"])


@router.post("", response_model=DeliveryResponse, status_code=status.HTTP_201_CREATED)
def create_delivery(data: DeliveryCreate, db: Session = Depends(get_db)):
    resident = db.query(User).filter(User.unit_number == data.unit_number).first()
    resident_id = resident.id if resident else None

    guard = db.query(User).filter(User.role == "guard").first()
    guard_id = guard.id if guard else None

    courier = data.courier_name or data.courier_company or "Courier"

    delivery = Delivery(
        unit_number=data.unit_number,
        resident_id=resident_id,
        courier_company=courier,
        tracking_number=data.tracking_number,
        package_description=data.package_description,
        status="Pending Pickup",
        logged_by_guard_id=guard_id,
        logged_at=datetime.utcnow(),
    )
    db.add(delivery)
    db.commit()
    db.refresh(delivery)

    return DeliveryResponse.model_validate(delivery)


@router.put("/{id}/pickup", response_model=DeliveryResponse)
def acknowledge_pickup(id: str, db: Session = Depends(get_db)):
    delivery = db.query(Delivery).filter(Delivery.id == id).first()
    if not delivery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Delivery record not found"
        )

    delivery.status = "Collected"
    delivery.collected_at = datetime.utcnow()
    db.commit()
    db.refresh(delivery)

    return DeliveryResponse.model_validate(delivery)


@router.get("", response_model=List[DeliveryResponse])
def list_deliveries(unit_number: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Delivery)
    if unit_number:
        query = query.filter(Delivery.unit_number == unit_number)
    deliveries = query.order_by(Delivery.logged_at.desc()).all()
    return [DeliveryResponse.model_validate(d) for d in deliveries]
