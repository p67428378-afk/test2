from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from datetime import datetime

from server.database import get_db
from server.models import User, Delivery
from server.schemas import (
    DeliveryListResponse,
    DeliveryAcceptResponse,
    DeliveryStatusUpdate,
    DeliveryStatusResponse,
)
from server.auth import get_current_user, require_volunteer

router = APIRouter(prefix="/deliveries", tags=["deliveries"])


@router.get("", response_model=List[DeliveryListResponse])
def list_deliveries(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    deliveries = db.query(Delivery).all()

    results = []
    for d in deliveries:
        req = d.request
        donation = req.donation if req else None
        restaurant = donation.restaurant if donation else None
        ngo = req.ngo if req else None

        results.append(
            {
                "id": d.id,
                "request_id": d.request_id,
                "volunteer_id": d.volunteer_id,
                "status": d.status,
                "description": donation.description if donation else "No description",
                "quantity": donation.quantity if donation else "No quantity",
                "pickup_address": restaurant.address
                if restaurant
                else "No pickup address",
                "delivery_address": ngo.address if ngo else "No delivery address",
            }
        )
    return results


@router.post("/{delivery_id}/accept", response_model=DeliveryAcceptResponse)
def accept_delivery(
    delivery_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_volunteer),
):
    delivery = db.query(Delivery).filter(Delivery.id == delivery_id).first()
    if not delivery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Delivery task not found"
        )

    if delivery.volunteer_id is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Delivery task already accepted",
        )

    delivery.volunteer_id = current_user.id
    delivery.status = "assigned"
    db.commit()
    db.refresh(delivery)
    return delivery


@router.put("/{delivery_id}/status", response_model=DeliveryStatusResponse)
def update_delivery_status(
    delivery_id: UUID,
    status_update: DeliveryStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    delivery = db.query(Delivery).filter(Delivery.id == delivery_id).first()
    if not delivery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Delivery task not found"
        )

    if delivery.volunteer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized (Assignee only)",
        )

    new_status = status_update.status
    if new_status not in ["picked_up", "delivered"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid status transition"
        )

    delivery.status = new_status

    # Update donation status accordingly
    req = delivery.request
    donation = req.donation if req else None

    if new_status == "picked_up":
        delivery.pickup_at = datetime.utcnow()
        if donation:
            donation.status = "in_transit"
    elif new_status == "delivered":
        delivery.delivered_at = datetime.utcnow()
        if donation:
            donation.status = "delivered"

    db.commit()
    db.refresh(delivery)
    return delivery
