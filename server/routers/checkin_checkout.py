import uuid
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Reservation, Room, Invoice, InvoiceItem
from server.schemas import CheckInRequest, CheckOutRequest

router = APIRouter(prefix="/api/v1", tags=["front-desk"])


@router.post("/check-in")
def check_in(req: CheckInRequest, db: Session = Depends(get_db)):
    reservation = (
        db.query(Reservation).filter(Reservation.id == req.reservation_id).first()
    )
    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reservation with id {req.reservation_id} not found",
        )

    if reservation.status == "CANCELLED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot check in a cancelled reservation",
        )

    if reservation.status == "CHECKED_IN":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reservation is already checked in",
        )

    if reservation.status == "CHECKED_OUT":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reservation has already checked out",
        )

    # Determine which room to assign
    target_room_id = req.room_id or reservation.room_id
    room = None

    if target_room_id:
        room = db.query(Room).filter(Room.id == target_room_id).first()
        if not room:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Room with id {target_room_id} not found",
            )
        if room.status not in ["Available", "Occupied"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Room {room.room_number} is currently '{room.status}' and cannot be assigned for check-in",
            )
    else:
        # Find first Available room matching room_type
        room = (
            db.query(Room)
            .filter(
                Room.room_type.ilike(f"%{reservation.room_type}%"),
                Room.status == "Available",
            )
            .first()
        )
        if not room:
            # Fallback to any available room
            room = db.query(Room).filter(Room.status == "Available").first()

        if not room:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="No available rooms found for check-in",
            )

    # Perform status transitions
    room.status = "Occupied"
    reservation.room_id = room.id
    reservation.status = "CHECKED_IN"

    # Sync invoice with assigned room rate
    invoice = db.query(Invoice).filter(Invoice.reservation_id == reservation.id).first()
    nights = max(1, (reservation.end_date - reservation.start_date).days)
    room_charges = float(nights * room.daily_rate)
    tax_amount = round(room_charges * 0.10, 2)

    if invoice:
        invoice.room_charges = room_charges
        invoice.tax_amount = tax_amount
        invoice.total_amount = round(
            room_charges + tax_amount + invoice.service_fees - invoice.discount_amount,
            2,
        )
    else:
        invoice = Invoice(
            id=str(uuid.uuid4()),
            reservation_id=reservation.id,
            room_charges=room_charges,
            tax_amount=tax_amount,
            service_fees=0.0,
            discount_amount=0.0,
            total_amount=round(room_charges + tax_amount, 2),
            payment_status="UNPAID",
        )
        db.add(invoice)

    db.commit()
    db.refresh(reservation)
    db.refresh(room)

    return {
        "message": "Check-in successful",
        "reservation_id": reservation.id,
        "guest_name": reservation.guest.full_name if reservation.guest else "",
        "room_number": room.room_number,
        "room_type": room.room_type,
        "status": reservation.status,
    }


@router.post("/check-out")
def check_out(req: CheckOutRequest, db: Session = Depends(get_db)):
    reservation = (
        db.query(Reservation).filter(Reservation.id == req.reservation_id).first()
    )
    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reservation with id {req.reservation_id} not found",
        )

    if reservation.status != "CHECKED_IN":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot check out reservation with status '{reservation.status}'. Must be 'CHECKED_IN'.",
        )

    # Calculate actual stay nights (handles early or normal checkout)
    today = date.today()
    if today > reservation.start_date:
        actual_nights = (today - reservation.start_date).days
    else:
        actual_nights = max(1, (reservation.end_date - reservation.start_date).days)

    room = None
    daily_rate = 150.0
    if reservation.room_id:
        room = db.query(Room).filter(Room.id == reservation.room_id).first()
        if room:
            daily_rate = room.daily_rate
            # Room transitions to Cleaning upon check-out
            room.status = "Cleaning"

    reservation.status = "CHECKED_OUT"

    # Compute billing
    room_charges = float(actual_nights * daily_rate)
    tax_rate = 0.10
    tax_amount = round(room_charges * tax_rate, 2)
    service_fees = float(req.service_fees or 0.0)

    # Handle promo code
    discount_amount = float(req.discount_amount or 0.0)
    if req.promo_code:
        promo = req.promo_code.strip().upper()
        if promo in ["WELCOME10", "PROMO10"]:
            discount_amount = max(discount_amount, round(room_charges * 0.10, 2))
        elif promo in ["SAVE20", "HOTEL20"]:
            discount_amount = max(discount_amount, 20.0)
        elif promo in ["VIP50"]:
            discount_amount = max(discount_amount, 50.0)

    total_amount = max(
        0.0, round(room_charges + tax_amount + service_fees - discount_amount, 2)
    )

    invoice = db.query(Invoice).filter(Invoice.reservation_id == reservation.id).first()
    if not invoice:
        invoice = Invoice(
            id=str(uuid.uuid4()),
            reservation_id=reservation.id,
            room_charges=room_charges,
            tax_amount=tax_amount,
            service_fees=service_fees,
            discount_amount=discount_amount,
            total_amount=total_amount,
            payment_status="UNPAID",
        )
        db.add(invoice)
        db.commit()
        db.refresh(invoice)
    else:
        invoice.room_charges = room_charges
        invoice.tax_amount = tax_amount
        invoice.service_fees = service_fees
        invoice.discount_amount = discount_amount
        invoice.total_amount = total_amount
        # Clear previous items
        db.query(InvoiceItem).filter(InvoiceItem.invoice_id == invoice.id).delete()

    # Create itemized billing records
    db.add(
        InvoiceItem(
            id=str(uuid.uuid4()),
            invoice_id=invoice.id,
            description=f"Room Charges ({actual_nights} nights @ ${daily_rate:.2f}/night)",
            amount=room_charges,
        )
    )
    db.add(
        InvoiceItem(
            id=str(uuid.uuid4()),
            invoice_id=invoice.id,
            description="State & Lodging Tax (10%)",
            amount=tax_amount,
        )
    )
    if service_fees > 0:
        db.add(
            InvoiceItem(
                id=str(uuid.uuid4()),
                invoice_id=invoice.id,
                description="Service & Amenities Fees",
                amount=service_fees,
            )
        )
    if discount_amount > 0:
        db.add(
            InvoiceItem(
                id=str(uuid.uuid4()),
                invoice_id=invoice.id,
                description=f"Discount Applied {f'({req.promo_code})' if req.promo_code else ''}",
                amount=-discount_amount,
            )
        )

    db.commit()
    db.refresh(invoice)
    db.refresh(reservation)

    return {
        "message": "Check-out successful",
        "reservation_id": reservation.id,
        "room_number": room.room_number if room else None,
        "room_status": room.status if room else None,
        "actual_nights": actual_nights,
        "invoice": {
            "id": invoice.id,
            "room_charges": invoice.room_charges,
            "tax_amount": invoice.tax_amount,
            "service_fees": invoice.service_fees,
            "discount_amount": invoice.discount_amount,
            "total_amount": invoice.total_amount,
            "payment_status": invoice.payment_status,
        },
    }
