from sqlalchemy.orm import Session
from server import models, schemas
import bcrypt
from datetime import date
from typing import Optional, List, Tuple


# Existing Password Reset CRUD
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


# Auth CRUD
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user_in: schemas.UserRegister):
    pwd_bytes = user_in.password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")

    db_user = models.User(
        email=user_in.email, name=user_in.name, hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        pwd_bytes = plain_password.encode("utf-8")
        hashed_bytes = hashed_password.encode("utf-8")
        return bcrypt.checkpw(pwd_bytes, hashed_bytes)
    except Exception:
        return False


def update_user(db: Session, user: models.User, user_in: schemas.UserUpdate):
    if user_in.name is not None:
        user.name = user_in.name  # type: ignore
    if user_in.email is not None:
        user.email = user_in.email  # type: ignore
    if user_in.phone is not None:
        user.phone = user_in.phone  # type: ignore
    db.commit()
    db.refresh(user)
    return user


# Package CRUD
def get_package(db: Session, package_id: str):
    return db.query(models.Package).filter(models.Package.id == package_id).first()


def get_packages(
    db: Session,
    destination: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    travelers: Optional[int] = None,
    package_ids: Optional[List[str]] = None,
    skip: int = 0,
    limit: int = 20,
) -> Tuple[List[models.Package], int]:
    query = db.query(models.Package)
    if package_ids:
        query = query.filter(models.Package.id.in_(package_ids))
    if destination:
        query = query.filter(models.Package.destination.ilike(f"%{destination}%"))

    # Real-time date and traveler filtering logic:
    # Since packages are always available, we can simulate filtering by checking if the package
    # duration fits within the start_date and end_date if both are provided.
    if start_date and end_date:
        requested_duration = (end_date - start_date).days
        if requested_duration > 0:
            query = query.filter(models.Package.duration_days <= requested_duration)

    # If travelers is specified, we can filter out packages that are too expensive or have specific constraints.
    # For this mock, we assume all packages can accommodate up to 10 travelers.
    if travelers and travelers > 10:
        # Return empty list if travelers exceed capacity
        return [], 0

    total = query.count()
    items = query.offset(skip).limit(limit).all()
    return items, total


def create_package(db: Session, package_data: dict):
    db_package = models.Package(**package_data)
    db.add(db_package)
    db.commit()
    db.refresh(db_package)
    return db_package


# Booking CRUD
def create_booking(
    db: Session, user_id: str, booking_in: schemas.BookingCreate, total_price: float
):
    db_booking = models.Booking(
        user_id=user_id,
        package_id=booking_in.package_id,
        start_date=booking_in.start_date,
        end_date=booking_in.end_date,
        number_of_travelers=booking_in.number_of_travelers,
        traveler_info=booking_in.traveler_info.dict(),
        total_price=total_price,
        status="pending",
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking


def get_booking(db: Session, booking_id: str):
    return db.query(models.Booking).filter(models.Booking.id == booking_id).first()


def get_user_bookings(db: Session, user_id: str):
    return db.query(models.Booking).filter(models.Booking.user_id == user_id).all()


def update_booking(
    db: Session, booking: models.Booking, booking_in: schemas.BookingUpdate
):
    if booking_in.start_date is not None:
        booking.start_date = booking_in.start_date  # type: ignore
    if booking_in.end_date is not None:
        booking.end_date = booking_in.end_date  # type: ignore
    if booking_in.number_of_travelers is not None:
        booking.number_of_travelers = booking_in.number_of_travelers  # type: ignore
        # Recalculate total price
        booking.total_price = (
            float(booking.package.price) * booking_in.number_of_travelers
        )  # type: ignore
    if booking_in.traveler_info is not None:
        booking.traveler_info = booking_in.traveler_info.dict()  # type: ignore
    if booking_in.status is not None:
        booking.status = booking_in.status  # type: ignore
    db.commit()
    db.refresh(booking)
    return booking


# Payment CRUD
def create_payment(
    db: Session, payment_in: schemas.PaymentCreate, transaction_id: str, status: str
):
    db_payment = models.Payment(
        booking_id=payment_in.booking_id,
        amount=payment_in.amount,
        status=status,
        transaction_id=transaction_id,
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment


# Review CRUD
def create_review(
    db: Session, package_id: str, user_name: str, rating: int, comment: str
):
    db_review = models.Review(
        package_id=package_id, user_name=user_name, rating=rating, comment=comment
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review
