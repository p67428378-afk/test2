import uuid
from datetime import date
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Room, Reservation
from server.schemas import RoomCreate, RoomOut, RoomUpdateStatus

router = APIRouter(prefix="/api/v1/rooms", tags=["rooms"])

VALID_ROOM_STATUSES = ["Available", "Occupied", "Cleaning", "Maintenance"]


@router.get("", response_model=List[RoomOut])
def get_rooms(
    status: Optional[str] = Query(
        None,
        description="Filter by status (Available, Occupied, Cleaning, Maintenance)",
    ),
    room_type: Optional[str] = Query(None, description="Filter by room type"),
    start_date: Optional[date] = Query(
        None, description="Start date for availability filter"
    ),
    end_date: Optional[date] = Query(
        None, description="End date for availability filter"
    ),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Room)

    if status:
        query = query.filter(Room.status == status)
    if room_type:
        query = query.filter(Room.room_type.ilike(f"%{room_type}%"))

    # If date range provided, filter out rooms booked during this period
    if start_date and end_date:
        if start_date >= end_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="start_date must be before end_date",
            )
        booked_room_ids = (
            db.query(Reservation.room_id)
            .filter(
                Reservation.room_id.isnot(None),
                Reservation.status.in_(["CONFIRMED", "CHECKED_IN"]),
                Reservation.start_date < end_date,
                Reservation.end_date > start_date,
            )
            .subquery()
        )

        query = query.filter(~Room.id.in_(booked_room_ids))

    rooms = query.offset(skip).limit(limit).all()
    return rooms


@router.post("", response_model=RoomOut, status_code=status.HTTP_201_CREATED)
def create_room(room_in: RoomCreate, db: Session = Depends(get_db)):
    existing = db.query(Room).filter(Room.room_number == room_in.room_number).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Room with number {room_in.room_number} already exists",
        )

    if room_in.status not in VALID_ROOM_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status '{room_in.status}'. Valid statuses: {', '.join(VALID_ROOM_STATUSES)}",
        )

    room = Room(
        id=str(uuid.uuid4()),
        room_number=room_in.room_number,
        room_type=room_in.room_type,
        daily_rate=room_in.daily_rate,
        status=room_in.status or "Available",
    )
    db.add(room)
    db.commit()
    db.refresh(room)
    return room


@router.get("/{room_id}", response_model=RoomOut)
def get_room(room_id: str, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Room with id {room_id} not found",
        )
    return room


@router.patch("/{room_id}/status", response_model=RoomOut)
def update_room_status(
    room_id: str,
    status_in: RoomUpdateStatus,
    db: Session = Depends(get_db),
):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Room with id {room_id} not found",
        )

    if status_in.status not in VALID_ROOM_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status '{status_in.status}'. Valid options: {', '.join(VALID_ROOM_STATUSES)}",
        )

    room.status = status_in.status
    db.commit()
    db.refresh(room)
    return room
