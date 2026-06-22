import uuid
from sqlalchemy import (
    Column,
    String,
    Integer,
    Numeric,
    DateTime,
    Date,
    Boolean,
    ForeignKey,
    JSON,
    Text,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    login_id = Column(String(255), unique=True, nullable=True)
    mobile_number = Column(String(20), unique=True, nullable=True)
    email = Column(String(255), unique=True, nullable=True)
    name = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)  # For saving personal info
    hashed_password = Column(String(255), nullable=False)
    security_question = Column(String(255), nullable=True)
    security_answer_hash = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    otps = relationship("OTP", back_populates="user")
    password_history = relationship("PasswordHistory", back_populates="user")
    bookings = relationship("Booking", back_populates="user")


class OTP(Base):
    __tablename__ = "otps"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    otp_code_hash = Column(String(255), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="otps")


class PasswordHistory(Base):
    __tablename__ = "password_history"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    changed_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="password_history")


class Package(Base):
    __tablename__ = "packages"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    destination = Column(String(255), nullable=False)
    duration_days = Column(Integer, nullable=False)
    image_url = Column(String(512), nullable=True)
    rating = Column(Numeric(3, 2), default=5.0, nullable=False)
    inclusions = Column(JSON, default=list, nullable=False)
    itinerary = Column(JSON, default=list, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    bookings = relationship("Booking", back_populates="package")
    reviews = relationship("Review", back_populates="package")


class Booking(Base):
    __tablename__ = "bookings"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    package_id = Column(String(36), ForeignKey("packages.id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    number_of_travelers = Column(Integer, nullable=False)
    traveler_info = Column(JSON, nullable=False)
    total_price = Column(Numeric(10, 2), nullable=False)
    status = Column(String(50), default="pending", nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="bookings")
    package = relationship("Package", back_populates="bookings")
    payment = relationship("Payment", uselist=False, back_populates="booking")


class Payment(Base):
    __tablename__ = "payments"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    booking_id = Column(String(36), ForeignKey("bookings.id"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String(50), default="pending", nullable=False)
    transaction_id = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    booking = relationship("Booking", back_populates="payment")


class Review(Base):
    __tablename__ = "reviews"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    package_id = Column(String(36), ForeignKey("packages.id"), nullable=False)
    user_name = Column(String(255), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime, default=func.now())

    package = relationship("Package", back_populates="reviews")
