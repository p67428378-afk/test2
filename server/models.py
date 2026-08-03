import uuid
from sqlalchemy import (
    Column,
    String,
    DateTime,
    Boolean,
    ForeignKey,
    Integer,
    Numeric,
    Float,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    login_id = Column(String(255), unique=True, nullable=True)
    mobile_number = Column(String(20), unique=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    security_question = Column(String(255), nullable=True)
    security_answer_hash = Column(String(255), nullable=True)

    # Library Management System fields
    email = Column(String(255), unique=True, nullable=True)
    full_name = Column(String(255), nullable=True)
    role = Column(
        String(50), default="member", nullable=False
    )  # 'librarian' or 'member'

    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    otps = relationship("OTP", back_populates="user")
    password_history = relationship("PasswordHistory", back_populates="user")
    loans = relationship("Loan", back_populates="member")


class OTP(Base):
    __tablename__ = "otps"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    otp_code_hash = Column(String(255), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="otps")


class PasswordHistory(Base):
    __tablename__ = "password_history"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    changed_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="password_history")


class Book(Base):
    __tablename__ = "books"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    author = Column(String(255), nullable=False)
    isbn = Column(String(255), unique=True, nullable=False)
    genre = Column(String(255), nullable=True)
    publication_year = Column(Integer, nullable=True)
    total_copies = Column(Integer, nullable=False, default=1)
    available_copies = Column(Integer, nullable=False, default=1)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    loans = relationship("Loan", back_populates="book")


class Loan(Base):
    __tablename__ = "loans"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    book_id = Column(UUID(as_uuid=True), ForeignKey("books.id"), nullable=False)
    member_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    checkout_date = Column(DateTime, default=func.now(), nullable=False)
    due_date = Column(DateTime, nullable=False)
    return_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    book = relationship("Book", back_populates="loans")
    member = relationship("User", back_populates="loans")
    fine = relationship("Fine", back_populates="loan", uselist=False)


class Fine(Base):
    __tablename__ = "fines"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    loan_id = Column(UUID(as_uuid=True), ForeignKey("loans.id"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    status = Column(
        String(50), default="outstanding", nullable=False
    )  # 'outstanding' or 'paid'
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    loan = relationship("Loan", back_populates="fine")


class InventoryItem(Base):
    __tablename__ = "inventory_items"
    item_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(String, nullable=True)
    quantity = Column(Integer, nullable=False, default=0)
    unit = Column(String(50), nullable=False)
    supplier = Column(String(255), nullable=True)
    category = Column(String(100), nullable=True)
    low_stock_threshold = Column(Integer, nullable=False, default=10)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )


# --- Bus Tracking App Models ---


class Route(Base):
    __tablename__ = "routes"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    route_number = Column(String(10), unique=True, nullable=False)
    route_name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    stops = relationship(
        "RouteStop", back_populates="route", cascade="all, delete-orphan"
    )
    buses = relationship("Bus", back_populates="route")


class Stop(Base):
    __tablename__ = "stops"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stop_name = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    routes = relationship(
        "RouteStop", back_populates="stop", cascade="all, delete-orphan"
    )


class RouteStop(Base):
    __tablename__ = "route_stops"
    route_id = Column(
        UUID(as_uuid=True),
        ForeignKey("routes.id", ondelete="CASCADE"),
        primary_key=True,
    )
    stop_id = Column(
        UUID(as_uuid=True), ForeignKey("stops.id", ondelete="CASCADE"), primary_key=True
    )
    stop_order = Column(Integer, nullable=False)

    route = relationship("Route", back_populates="stops")
    stop = relationship("Stop", back_populates="routes")


class Bus(Base):
    __tablename__ = "buses"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    vehicle_id = Column(String(50), unique=True, nullable=False)
    route_id = Column(
        UUID(as_uuid=True), ForeignKey("routes.id", ondelete="CASCADE"), nullable=False
    )
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    route = relationship("Route", back_populates="buses")
    locations = relationship(
        "BusLocation", back_populates="bus", cascade="all, delete-orphan"
    )


class BusLocation(Base):
    __tablename__ = "bus_locations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bus_id = Column(
        UUID(as_uuid=True), ForeignKey("buses.id", ondelete="CASCADE"), nullable=False
    )
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=func.now(), nullable=False)

    bus = relationship("Bus", back_populates="locations")
