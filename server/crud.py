from sqlalchemy.orm import Session
from server import models, schemas
from typing import Optional
from datetime import date
import uuid


# Existing CRUD operations
def get_user_by_login_id(db: Session, login_id: str):
    return db.query(models.User).filter(models.User.login_id == login_id).first()


def get_user_by_mobile_number(db: Session, mobile_number: str):
    return (
        db.query(models.User).filter(models.User.mobile_number == mobile_number).first()
    )


def create_otp(db: Session, user_id: str, otp_code_hash: str, expires_at: str):
    db_otp = models.OTP(
        user_id=user_id, otp_code_hash=otp_code_hash, expires_at=expires_at
    )
    db.add(db_otp)
    db.commit()
    db.refresh(db_otp)
    return db_otp


def get_otp(db: Session, otp_session_id: str):
    return db.query(models.OTP).filter(models.OTP.id == otp_session_id).first()


def update_otp_as_used(db: Session, otp: models.OTP):
    otp.is_used = True  # type: ignore
    db.commit()
    db.refresh(otp)
    return otp


def create_password_history(db: Session, user_id: str, hashed_password: str):
    db_password_history = models.PasswordHistory(
        user_id=user_id, hashed_password=hashed_password
    )
    db.add(db_password_history)
    db.commit()
    db.refresh(db_password_history)
    return db_password_history


def update_user_password(db: Session, user: models.User, hashed_password: str):
    user.hashed_password = hashed_password  # type: ignore
    db.commit()
    db.refresh(user)
    return user


# New CRUD operations for Hotel Management System
def create_room(db: Session, room: schemas.RoomCreate):
    db_room = models.Room(
        room_number=room.room_number,
        room_type=room.room_type,
        price_per_night=room.price_per_night,
    )
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room


def get_room_by_number(db: Session, room_number: str):
    return db.query(models.Room).filter(models.Room.room_number == room_number).first()


def get_room(db: Session, room_id: uuid.UUID):
    if isinstance(room_id, str):
        room_id = uuid.UUID(room_id)
    return db.query(models.Room).filter(models.Room.id == room_id).first()


def get_available_rooms(
    db: Session,
    check_in_date: date,
    check_out_date: date,
    room_type: Optional[str] = None,
):
    # Find all room IDs that have overlapping reservations that are not Cancelled
    overlapping_room_ids = db.query(models.Reservation.room_id).filter(
        models.Reservation.status != "Cancelled",
        models.Reservation.check_in_date < check_out_date,
        models.Reservation.check_out_date > check_in_date,
    )

    query = db.query(models.Room).filter(~models.Room.id.in_(overlapping_room_ids))
    if room_type:
        query = query.filter(models.Room.room_type == room_type)
    return query.all()


def create_reservation(db: Session, reservation: schemas.ReservationCreate):
    # Create guest first
    db_guest = models.Guest(
        full_name=reservation.guest.full_name,
        phone_number=reservation.guest.phone_number,
        email_address=reservation.guest.email_address,
    )
    db.add(db_guest)
    db.commit()
    db.refresh(db_guest)

    # Create reservation
    db_reservation = models.Reservation(
        room_id=reservation.room_id,
        guest_id=db_guest.id,
        check_in_date=reservation.check_in_date,
        check_out_date=reservation.check_out_date,
        number_of_guests=reservation.number_of_guests,
        estimated_arrival_time=reservation.estimated_arrival_time,
        status="Confirmed",
    )
    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    return db_reservation


def get_reservation(db: Session, reservation_id: uuid.UUID):
    if isinstance(reservation_id, str):
        reservation_id = uuid.UUID(reservation_id)
    return (
        db.query(models.Reservation)
        .filter(models.Reservation.id == reservation_id)
        .first()
    )


def update_reservation(
    db: Session,
    db_reservation: models.Reservation,
    reservation_update: schemas.ReservationUpdate,
):
    db_reservation.check_in_date = reservation_update.check_in_date  # type: ignore
    db_reservation.check_out_date = reservation_update.check_out_date  # type: ignore
    db_reservation.number_of_guests = reservation_update.number_of_guests  # type: ignore
    db_reservation.estimated_arrival_time = reservation_update.estimated_arrival_time  # type: ignore
    db_reservation.status = reservation_update.status  # type: ignore

    # Update guest details
    if db_reservation.guest:
        db_reservation.guest.full_name = reservation_update.guest.full_name  # type: ignore
        db_reservation.guest.phone_number = reservation_update.guest.phone_number  # type: ignore
        db_reservation.guest.email_address = reservation_update.guest.email_address  # type: ignore

    db.commit()
    db.refresh(db_reservation)
    return db_reservation


def get_reservations(
    db: Session, skip: int = 0, limit: int = 20, search: Optional[str] = None
):
    query = db.query(models.Reservation).join(models.Guest)
    if search:
        is_uuid = False
        try:
            uuid.UUID(search)
            is_uuid = True
        except ValueError:
            pass

        if is_uuid:
            query = query.filter(models.Reservation.id == search)
        else:
            query = query.filter(models.Guest.full_name.ilike(f"%{search}%"))
    return query.offset(skip).limit(limit).all()
