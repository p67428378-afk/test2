from sqlalchemy.orm import Session
from server import models, schemas
from datetime import datetime
from typing import Optional, Any
import uuid


# Existing CRUD functions
def get_user_by_login_id(db: Session, login_id: str):
    return db.query(models.User).filter(models.User.login_id == login_id).first()


def get_user_by_mobile_number(db: Session, mobile_number: str):
    return (
        db.query(models.User).filter(models.User.mobile_number == mobile_number).first()
    )


def create_otp(db: Session, user_id: Any, otp_code_hash: str, expires_at: str):
    u_id = uuid.UUID(user_id) if isinstance(user_id, str) else user_id
    db_otp = models.OTP(
        user_id=u_id, otp_code_hash=otp_code_hash, expires_at=expires_at
    )
    db.add(db_otp)
    db.commit()
    db.refresh(db_otp)
    return db_otp


def get_otp(db: Session, otp_session_id: Any):
    o_id = (
        uuid.UUID(otp_session_id) if isinstance(otp_session_id, str) else otp_session_id
    )
    return db.query(models.OTP).filter(models.OTP.id == o_id).first()


def update_otp_as_used(db: Session, otp: models.OTP):
    otp.is_used = True  # type: ignore
    db.commit()
    db.refresh(otp)
    return otp


def create_password_history(db: Session, user_id: Any, hashed_password: str):
    u_id = uuid.UUID(user_id) if isinstance(user_id, str) else user_id
    db_password_history = models.PasswordHistory(
        user_id=u_id, hashed_password=hashed_password
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


# New CRUD functions for Photographer Portfolio & Booking


def get_galleries(db: Session):
    return db.query(models.Gallery).all()


def get_gallery_by_id(db: Session, gallery_id: Any):
    g_id = uuid.UUID(gallery_id) if isinstance(gallery_id, str) else gallery_id
    return db.query(models.Gallery).filter(models.Gallery.id == g_id).first()


def get_gallery_by_name(db: Session, name: str):
    return db.query(models.Gallery).filter(models.Gallery.name == name).first()


def create_gallery(db: Session, gallery: schemas.GalleryCreate):
    db_gallery = models.Gallery(name=gallery.name, description=gallery.description)
    db.add(db_gallery)
    db.commit()
    db.refresh(db_gallery)
    return db_gallery


def get_images_by_gallery(db: Session, gallery_id: Any):
    g_id = uuid.UUID(gallery_id) if isinstance(gallery_id, str) else gallery_id
    return db.query(models.Image).filter(models.Image.gallery_id == g_id).all()


def get_image_by_id(db: Session, image_id: Any):
    i_id = uuid.UUID(image_id) if isinstance(image_id, str) else image_id
    return db.query(models.Image).filter(models.Image.id == i_id).first()


def create_image(db: Session, image: schemas.ImageCreate):
    g_id = (
        uuid.UUID(image.gallery_id)
        if isinstance(image.gallery_id, str)
        else image.gallery_id
    )
    db_image = models.Image(gallery_id=g_id, url=image.url, title=image.title)
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image


def get_booking(db: Session, booking_id: Any):
    b_id = uuid.UUID(booking_id) if isinstance(booking_id, str) else booking_id
    return db.query(models.Booking).filter(models.Booking.id == b_id).first()


def get_bookings_by_date_range(db: Session, start_date: datetime, end_date: datetime):
    return (
        db.query(models.Booking)
        .filter(
            models.Booking.booking_date >= start_date,
            models.Booking.booking_date <= end_date,
        )
        .all()
    )


def create_booking(db: Session, booking: schemas.BookingCreate):
    db_booking = models.Booking(
        client_name=booking.client_name,
        client_email=booking.client_email,
        client_phone=booking.client_phone,
        session_type=booking.session_type,
        booking_date=booking.booking_date,
        status="pending",
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking


def update_booking_status(
    db: Session, booking_id: Any, status: str, payment_intent_id: Optional[str] = None
):
    b_id = uuid.UUID(booking_id) if isinstance(booking_id, str) else booking_id
    db_booking = get_booking(db, b_id)
    if db_booking:
        db_booking.status = status  # type: ignore
        if payment_intent_id:
            db_booking.payment_intent_id = payment_intent_id  # type: ignore
        db.commit()
        db.refresh(db_booking)
    return db_booking


def create_inquiry(db: Session, inquiry: schemas.InquiryCreate):
    db_inquiry = models.Inquiry(
        name=inquiry.name, email=inquiry.email, message=inquiry.message
    )
    db.add(db_inquiry)
    db.commit()
    db.refresh(db_inquiry)
    return db_inquiry
