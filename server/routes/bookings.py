from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from server.database import get_db
from server import models, schemas, auth

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.get("", response_model=List[schemas.BookingResponse])
def get_bookings(
    skip: int = 0,
    limit: int = 20,
    current_guide: models.Guide = Depends(auth.get_current_guide),
    db: Session = Depends(get_db),
):
    bookings = (
        db.query(models.Booking)
        .filter(models.Booking.guide_id == current_guide.id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return bookings


@router.get("/{booking_id}", response_model=schemas.BookingResponse)
def get_booking_detail(
    booking_id: UUID,
    current_guide: models.Guide = Depends(auth.get_current_guide),
    db: Session = Depends(get_db),
):
    booking = (
        db.query(models.Booking)
        .filter(
            models.Booking.id == booking_id, models.Booking.guide_id == current_guide.id
        )
        .first()
    )
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found or does not belong to the authenticated guide",
        )
    return booking


@router.put("/{booking_id}", response_model=schemas.BookingResponse)
def update_booking_status(
    booking_id: UUID,
    request: schemas.BookingUpdateStatus,
    current_guide: models.Guide = Depends(auth.get_current_guide),
    db: Session = Depends(get_db),
):
    booking = (
        db.query(models.Booking)
        .filter(
            models.Booking.id == booking_id, models.Booking.guide_id == current_guide.id
        )
        .first()
    )
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found or does not belong to the authenticated guide",
        )

    if request.status not in ["confirmed", "cancelled"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid status transition"
        )

    booking.status = request.status
    db.commit()
    db.refresh(booking)
    return booking


@router.get("/{booking_id}/messages", response_model=List[schemas.MessageResponse])
def get_booking_messages(
    booking_id: UUID,
    current_guide: models.Guide = Depends(auth.get_current_guide),
    db: Session = Depends(get_db),
):
    # Verify booking exists and belongs to guide
    booking = (
        db.query(models.Booking)
        .filter(
            models.Booking.id == booking_id, models.Booking.guide_id == current_guide.id
        )
        .first()
    )
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found"
        )

    messages = (
        db.query(models.Message)
        .filter(models.Message.booking_id == booking_id)
        .order_by(models.Message.sent_at.asc())
        .all()
    )
    return messages


@router.post("/{booking_id}/messages", response_model=schemas.MessageResponse)
def send_booking_message(
    booking_id: UUID,
    request: schemas.MessageCreate,
    current_guide: models.Guide = Depends(auth.get_current_guide),
    db: Session = Depends(get_db),
):
    if not request.message_body.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Empty message body"
        )

    # Verify booking exists and belongs to guide
    booking = (
        db.query(models.Booking)
        .filter(
            models.Booking.id == booking_id, models.Booking.guide_id == current_guide.id
        )
        .first()
    )
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found"
        )

    db_message = models.Message(
        booking_id=booking_id,
        sender_id=current_guide.id,
        message_body=request.message_body,
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message
