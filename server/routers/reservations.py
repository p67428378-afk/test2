import uuid
from datetime import date
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Reservation, Guest, Room, Invoice, InvoiceItem
from server.schemas import (
    ReservationCreate,
    ReservationUpdate,
    ReservationOut,
)

router = APIRouter(prefix="/api/v1/reservations", tags=["reservations"])

VALID_RESERVATION_STATUSES = ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"]


def check_room_availability(
    db: Session,
    room_id: Optional[str],
    room_type: str,
    start_date: date,
    end_date: date,
    exclude_reservation_id: Optional[str] = None,
) -> bool:
    if room_id:
        query = db.query(Reservation).filter(
            Reservation.room_id == room_id,
            Reservation.status.in_(["CONFIRMED", "CHECKED_IN"]),
            Reservation.start_date < end_date,
            Reservation.end_date > start_date,
        )
        if exclude_reservation_id:
            query = query.filter(Reservation.id != exclude_reservation_id)
        return query.first() is None
    else:
        # Check if total rooms of this room_type exceed overlapping bookings
        total_matching_rooms = (
            db.query(Room).filter(Room.room_type.ilike(f"%{room_type}%")).count()
        )
        if total_matching_rooms == 0:
            return False

        query = db.query(Reservation).filter(
            Reservation.room_type.ilike(f"%{room_type}%"),
            Reservation.status.in_(["CONFIRMED", "CHECKED_IN"]),
            Reservation.start_date < end_date,
            Reservation.end_date > start_date,
        )
        if exclude_reservation_id:
            query = query.filter(Reservation.id != exclude_reservation_id)
        overlapping_count = query.count()

        return overlapping_count < total_matching_rooms


@router.get("", response_model=List[ReservationOut])
def get_reservations(
    guest_name: Optional[str] = Query(None, description="Search by guest full name"),
    status: Optional[str] = Query(
        None,
        description="Filter by status (CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED)",
    ),
    room_type: Optional[str] = Query(None, description="Filter by room type"),
    start_date: Optional[date] = Query(
        None, description="Filter reservations starting on or after this date"
    ),
    end_date: Optional[date] = Query(
        None, description="Filter reservations ending on or before this date"
    ),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Reservation).join(Guest)

    if guest_name:
        query = query.filter(Guest.full_name.ilike(f"%{guest_name}%"))
    if status:
        query = query.filter(Reservation.status == status)
    if room_type:
        query = query.filter(Reservation.room_type.ilike(f"%{room_type}%"))
    if start_date:
        query = query.filter(Reservation.start_date >= start_date)
    if end_date:
        query = query.filter(Reservation.end_date <= end_date)

    reservations = (
        query.order_by(Reservation.created_at.desc()).offset(skip).limit(limit).all()
    )
    return reservations


@router.post("", response_model=ReservationOut, status_code=status.HTTP_201_CREATED)
def create_reservation(res_in: ReservationCreate, db: Session = Depends(get_db)):
    if res_in.start_date >= res_in.end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="start_date must be before end_date",
        )

    # Check or create guest
    guest = db.query(Guest).filter(Guest.email == res_in.guest.email).first()
    if not guest:
        guest = Guest(
            id=str(uuid.uuid4()),
            full_name=res_in.guest.full_name,
            email=res_in.guest.email,
            phone=res_in.guest.phone,
        )
        db.add(guest)
        db.commit()
        db.refresh(guest)
    else:
        # Update contact info if changed
        guest.full_name = res_in.guest.full_name
        guest.phone = res_in.guest.phone
        db.commit()

    # Verify room availability
    is_available = check_room_availability(
        db,
        room_id=res_in.room_id,
        room_type=res_in.room_type,
        start_date=res_in.start_date,
        end_date=res_in.end_date,
    )
    if not is_available:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="No available room for selected room type and dates",
        )

    assigned_room = None
    if res_in.room_id:
        assigned_room = db.query(Room).filter(Room.id == res_in.room_id).first()
        if not assigned_room:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Room with id {res_in.room_id} not found",
            )

    reservation = Reservation(
        id=str(uuid.uuid4()),
        guest_id=guest.id,
        room_id=res_in.room_id,
        room_type=res_in.room_type,
        start_date=res_in.start_date,
        end_date=res_in.end_date,
        status="CONFIRMED",
    )
    db.add(reservation)
    db.commit()
    db.refresh(reservation)

    # Create initial invoice
    nights = (res_in.end_date - res_in.start_date).days
    rate = assigned_room.daily_rate if assigned_room else 150.0
    # Try to find default rate for room_type if not assigned
    if not assigned_room:
        first_room = (
            db.query(Room).filter(Room.room_type.ilike(f"%{res_in.room_type}%")).first()
        )
        if first_room:
            rate = first_room.daily_rate

    room_charges = float(nights * rate)
    tax_amount = round(room_charges * 0.10, 2)
    service_fees = 0.0
    discount_amount = 0.0
    total_amount = round(room_charges + tax_amount + service_fees - discount_amount, 2)

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

    db.add(
        InvoiceItem(
            id=str(uuid.uuid4()),
            invoice_id=invoice.id,
            description=f"Room Charges ({nights} nights @ ${rate:.2f}/night)",
            amount=room_charges,
        )
    )
    db.commit()

    db.refresh(reservation)
    return reservation


@router.get("/{reservation_id}", response_model=ReservationOut)
def get_reservation(reservation_id: str, db: Session = Depends(get_db)):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reservation with id {reservation_id} not found",
        )
    return reservation


@router.put("/{reservation_id}", response_model=ReservationOut)
def update_reservation(
    reservation_id: str,
    res_update: ReservationUpdate,
    db: Session = Depends(get_db),
):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reservation with id {reservation_id} not found",
        )

    new_start = res_update.start_date or reservation.start_date
    new_end = res_update.end_date or reservation.end_date
    new_room_type = res_update.room_type or reservation.room_type
    new_room_id = (
        res_update.room_id if res_update.room_id is not None else reservation.room_id
    )

    if new_start >= new_end:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="start_date must be before end_date",
        )

    # Check availability if dates, room_type or room_id changed
    if (
        new_start != reservation.start_date
        or new_end != reservation.end_date
        or new_room_type != reservation.room_type
        or new_room_id != reservation.room_id
    ):
        is_avail = check_room_availability(
            db,
            room_id=new_room_id,
            room_type=new_room_type,
            start_date=new_start,
            end_date=new_end,
            exclude_reservation_id=reservation.id,
        )
        if not is_avail:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Selected dates/room are not available for booking",
            )

    if res_update.guest:
        if reservation.guest:
            reservation.guest.full_name = res_update.guest.full_name
            reservation.guest.email = res_update.guest.email
            reservation.guest.phone = res_update.guest.phone

    reservation.start_date = new_start
    reservation.end_date = new_end
    reservation.room_type = new_room_type
    reservation.room_id = new_room_id
    if res_update.status:
        if res_update.status not in VALID_RESERVATION_STATUSES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status '{res_update.status}'",
            )
        reservation.status = res_update.status

    # Recalculate invoice
    invoice = db.query(Invoice).filter(Invoice.reservation_id == reservation.id).first()
    if invoice:
        nights = (new_end - new_start).days
        rate = 150.0
        if new_room_id:
            room = db.query(Room).filter(Room.id == new_room_id).first()
            if room:
                rate = room.daily_rate
        else:
            first_room = (
                db.query(Room)
                .filter(Room.room_type.ilike(f"%{new_room_type}%"))
                .first()
            )
            if first_room:
                rate = first_room.daily_rate

        invoice.room_charges = float(nights * rate)
        invoice.tax_amount = round(invoice.room_charges * 0.10, 2)
        invoice.total_amount = round(
            invoice.room_charges
            + invoice.tax_amount
            + invoice.service_fees
            - invoice.discount_amount,
            2,
        )

    db.commit()
    db.refresh(reservation)
    return reservation


@router.post("/{reservation_id}/cancel", response_model=ReservationOut)
def cancel_reservation(reservation_id: str, db: Session = Depends(get_db)):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reservation with id {reservation_id} not found",
        )

    if reservation.status == "CANCELLED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reservation is already cancelled",
        )

    reservation.status = "CANCELLED"

    # If room was assigned and occupied, release it
    if reservation.room_id:
        room = db.query(Room).filter(Room.id == reservation.room_id).first()
        if room and room.status == "Occupied":
            room.status = "Available"

    db.commit()
    db.refresh(reservation)
    return reservation
