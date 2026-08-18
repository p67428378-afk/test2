from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func

from server.database import get_db
from server.models import Booking, Schedule, User, Attendance
from server.schemas import (
    BookingCreate,
    BookingResponse,
    ScheduleResponse,
    TourResponse,
    UserResponse,
)
from server.auth import get_current_user, require_roles

router = APIRouter(prefix="/api/v1/bookings", tags=["Bookings"])


def build_booking_response(booking: Booking, db: Session) -> BookingResponse:
    schedule_res = None
    if booking.schedule:
        booked = (
            db.query(func.coalesce(func.sum(Booking.ticket_count), 0))
            .filter(
                Booking.schedule_id == booking.schedule.id,
                Booking.status == "Confirmed",
            )
            .scalar()
        ) or 0
        remaining = max(0, booking.schedule.max_capacity - booked)

        tour_res = (
            TourResponse.model_validate(booking.schedule.tour)
            if booking.schedule.tour
            else None
        )
        guide_res = (
            UserResponse.model_validate(booking.schedule.guide)
            if booking.schedule.guide
            else None
        )

        schedule_res = ScheduleResponse(
            id=booking.schedule.id,
            tour_id=booking.schedule.tour_id,
            guide_id=booking.schedule.guide_id,
            start_time=booking.schedule.start_time,
            max_capacity=booking.schedule.max_capacity,
            booked_tickets=int(booked),
            remaining_capacity=remaining,
            tour=tour_res,
            guide=guide_res,
        )

    visitor_res = (
        UserResponse.model_validate(booking.visitor) if booking.visitor else None
    )

    return BookingResponse(
        id=booking.id,
        schedule_id=booking.schedule_id,
        visitor_id=booking.visitor_id,
        ticket_count=booking.ticket_count,
        status=booking.status,
        created_at=booking.created_at,
        schedule=schedule_res,
        visitor=visitor_res,
    )


@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking_in: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    schedule = db.query(Schedule).filter(Schedule.id == booking_in.schedule_id).first()
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found",
        )

    # Check capacity limit
    booked = (
        db.query(func.coalesce(func.sum(Booking.ticket_count), 0))
        .filter(Booking.schedule_id == schedule.id, Booking.status == "Confirmed")
        .scalar()
    ) or 0

    remaining = schedule.max_capacity - booked

    if booking_in.ticket_count > remaining:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot book {booking_in.ticket_count} tickets. Only {remaining} spots remaining.",
        )

    new_booking = Booking(
        schedule_id=booking_in.schedule_id,
        visitor_id=current_user.id,
        ticket_count=booking_in.ticket_count,
        status="Confirmed",
    )
    db.add(new_booking)
    db.flush()

    # Automatically create attendance record
    attendance = Attendance(
        booking_id=new_booking.id,
        status="Unchecked",
    )
    db.add(attendance)
    db.commit()

    db.refresh(new_booking)
    return build_booking_response(new_booking, db)


@router.get("/my-bookings", response_model=List[BookingResponse])
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bookings = (
        db.query(Booking)
        .options(
            joinedload(Booking.schedule).joinedload(Schedule.tour),
            joinedload(Booking.schedule).joinedload(Schedule.guide),
            joinedload(Booking.visitor),
        )
        .filter(Booking.visitor_id == current_user.id)
        .order_by(Booking.created_at.desc())
        .all()
    )
    return [build_booking_response(b, db) for b in bookings]


@router.get("", response_model=List[BookingResponse])
def list_all_bookings(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("Administrator", "Guide")),
):
    bookings = (
        db.query(Booking)
        .options(
            joinedload(Booking.schedule).joinedload(Schedule.tour),
            joinedload(Booking.schedule).joinedload(Schedule.guide),
            joinedload(Booking.visitor),
        )
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [build_booking_response(b, db) for b in bookings]


@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(
    booking_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = (
        db.query(Booking)
        .options(
            joinedload(Booking.schedule).joinedload(Schedule.tour),
            joinedload(Booking.schedule).joinedload(Schedule.guide),
            joinedload(Booking.visitor),
        )
        .filter(Booking.id == booking_id)
        .first()
    )
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found",
        )

    if current_user.role == "Visitor" and booking.visitor_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation not permitted",
        )

    return build_booking_response(booking, db)


@router.post("/{booking_id}/cancel", response_model=BookingResponse)
def cancel_booking(
    booking_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found",
        )

    if current_user.role == "Visitor" and booking.visitor_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation not permitted",
        )

    booking.status = "Cancelled"
    db.commit()
    db.refresh(booking)
    return build_booking_response(booking, db)


@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(
    booking_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found",
        )

    if current_user.role == "Visitor" and booking.visitor_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation not permitted",
        )

    booking.status = "Cancelled"
    db.commit()
    return None
