"""
Module: server.routers.deliveries
Purpose: Deliveries router.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.delivery import Delivery
from server.models.order import Order
from server.models.user import User
from server.routers.auth import get_current_user
from server.schemas.delivery import DeliveryLocationUpdate, DeliveryResponse

router = APIRouter(prefix="/deliveries", tags=["deliveries"])


@router.get("/available", response_model=List[DeliveryResponse])
def list_available_deliveries(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """
    Get list of deliveries that are ready for pickup and have no driver assigned.
    """
    if current_user.role != "delivery" and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only delivery partners can view available tasks",
        )

    # Enforce that the driver must be online to receive/view tasks (AC 10)
    if current_user.role == "delivery" and not current_user.is_online:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must set your availability to Online to view available tasks",
        )

    # Find deliveries where order status is 'ready_for_pickup' and driver_id is null
    deliveries = (
        db.query(Delivery)
        .join(Order)
        .filter(Order.status == "ready_for_pickup", Delivery.driver_id.is_(None))
        .all()
    )

    return deliveries


@router.put("/{id}/accept", response_model=DeliveryResponse)
def accept_delivery(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Accept a delivery task.
    """
    if current_user.role != "delivery":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only delivery partners can accept tasks",
        )

    # Enforce that the driver must be online to accept tasks (AC 10)
    if not current_user.is_online:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must set your availability to Online to accept tasks",
        )

    delivery = db.query(Delivery).filter(Delivery.id == id).first()
    if not delivery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Delivery task not found"
        )

    if delivery.driver_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Delivery task already accepted by another driver",
        )

    delivery.driver_id = current_user.id  # type: ignore
    delivery.status = "accepted"  # type: ignore

    db.add(delivery)
    db.commit()
    db.refresh(delivery)
    return delivery


@router.put("/{id}/location", response_model=DeliveryResponse)
def update_location(
    id: str,
    payload: DeliveryLocationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update delivery partner's real-time location.
    """
    delivery = db.query(Delivery).filter(Delivery.id == id).first()
    if not delivery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Delivery not found"
        )

    if delivery.driver_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the assigned driver can update location",
        )

    delivery.current_latitude = payload.latitude  # type: ignore
    delivery.current_longitude = payload.longitude  # type: ignore

    db.add(delivery)
    db.commit()
    db.refresh(delivery)
    return delivery


@router.get("/{id}", response_model=DeliveryResponse)
def get_delivery(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get delivery details.
    """
    delivery = db.query(Delivery).filter(Delivery.id == id).first()
    if not delivery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Delivery not found"
        )

    # Check authorization
    if current_user.role == "customer":
        order = db.query(Order).filter(Order.id == delivery.order_id).first()
        if not order or order.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized"
            )
    elif current_user.role == "delivery" and delivery.driver_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized"
        )

    return delivery
