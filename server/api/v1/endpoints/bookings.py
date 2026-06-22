from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from server import schemas, crud, models
from server.database import get_db
from server.api.v1.endpoints.auth import get_current_user

router = APIRouter()


@router.post("/bookings", response_model=schemas.BookingCreateResponse)
def create_booking(
    booking_in: schemas.BookingCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    package = crud.get_package(db, package_id=booking_in.package_id)
    if not package:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Package not found"
        )

    # Real-time availability and date validation
    if booking_in.start_date < date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start date cannot be in the past",
        )
    if booking_in.end_date <= booking_in.start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date must be after start date",
        )

    # Real-time availability/inventory check:
    # Limit to maximum 5 active bookings for the same package on overlapping dates
    overlapping_bookings = (
        db.query(models.Booking)
        .filter(
            models.Booking.package_id == booking_in.package_id,
            models.Booking.status != "cancelled",
            models.Booking.start_date <= booking_in.end_date,
            models.Booking.end_date >= booking_in.start_date,
        )
        .count()
    )

    if overlapping_bookings >= 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Package unavailable for these dates (fully booked)",
        )

    # Calculate total price
    total_price = float(package.price) * booking_in.number_of_travelers

    # Create booking
    booking = crud.create_booking(
        db, user_id=str(current_user.id), booking_in=booking_in, total_price=total_price
    )

    return {
        "booking_id": booking.id,
        "created_at": booking.created_at,
        "status": booking.status,
        "total_price": float(booking.total_price),
    }


@router.get("/bookings/{booking_id}", response_model=schemas.BookingDetailResponse)
def get_booking(
    booking_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    booking = crud.get_booking(db, booking_id=booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found"
        )

    if booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this booking",
        )

    return {
        "id": booking.id,
        "package_id": booking.package_id,
        "package_name": booking.package.name,
        "start_date": booking.start_date,
        "end_date": booking.end_date,
        "number_of_travelers": booking.number_of_travelers,
        "traveler_info": booking.traveler_info,
        "total_price": float(booking.total_price),
        "status": booking.status,
        "created_at": booking.created_at,
    }


@router.put("/bookings/{booking_id}", response_model=schemas.BookingDetailResponse)
def update_booking(
    booking_id: str,
    booking_in: schemas.BookingUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    booking = crud.get_booking(db, booking_id=booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found"
        )

    if booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this booking",
        )

    # Validate dates if updated
    start = booking_in.start_date or booking.start_date
    end = booking_in.end_date or booking.end_date
    if start < date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start date cannot be in the past",
        )
    if end <= start:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date must be after start date",
        )

    updated_booking = crud.update_booking(db, booking=booking, booking_in=booking_in)

    return {
        "id": updated_booking.id,
        "package_id": updated_booking.package_id,
        "package_name": updated_booking.package.name,
        "start_date": updated_booking.start_date,
        "end_date": updated_booking.end_date,
        "number_of_travelers": updated_booking.number_of_travelers,
        "traveler_info": updated_booking.traveler_info,
        "total_price": float(updated_booking.total_price),
        "status": updated_booking.status,
        "created_at": updated_booking.created_at,
    }


@router.get("/users/me/bookings", response_model=List[schemas.UserBookingItem])
def get_user_bookings(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    bookings = crud.get_user_bookings(db, user_id=str(current_user.id))
    result = []
    for b in bookings:
        result.append(
            {
                "id": b.id,
                "package_id": b.package_id,
                "package_name": b.package.name,
                "start_date": b.start_date,
                "end_date": b.end_date,
                "total_price": float(b.total_price),
                "status": b.status,
                "created_at": b.created_at,
            }
        )
    return result
