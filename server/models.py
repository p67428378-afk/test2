import uuid
from sqlalchemy import (
    Column,
    String,
    DateTime,
    Boolean,
    ForeignKey,
    Date,
    Numeric,
    UUID,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    username = Column(String(255), unique=True, nullable=True)
    email = Column(String(255), unique=True, nullable=True)
    password_hash = Column(String(255), nullable=True)
    role = Column(String(50), nullable=True)

    # Legacy fields for password reset microservice
    login_id = Column(String(255), unique=True, nullable=True)
    mobile_number = Column(String(20), unique=True, nullable=True)
    hashed_password = Column(String(255), nullable=True)
    security_question = Column(String(255), nullable=True)
    security_answer_hash = Column(String(255), nullable=True)

    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    otps = relationship("OTP", back_populates="user")
    password_history = relationship("PasswordHistory", back_populates="user")
    loans = relationship("Loan", back_populates="user")


class OTP(Base):
    __tablename__ = "otps"
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID, ForeignKey("users.id"), nullable=False)
    otp_code_hash = Column(String(255), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="otps")


class PasswordHistory(Base):
    __tablename__ = "password_history"
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID, ForeignKey("users.id"), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    changed_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="password_history")


class Book(Base):
    __tablename__ = "books"
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    author = Column(String(255), nullable=False)
    isbn = Column(String(50), unique=True, nullable=False)
    published_date = Column(Date, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    copies = relationship(
        "BookCopy", back_populates="book", cascade="all, delete-orphan"
    )


class BookCopy(Base):
    __tablename__ = "book_copies"
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    book_id = Column(UUID, ForeignKey("books.id"), nullable=False)
    status = Column(String(50), default="available", nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    book = relationship("Book", back_populates="copies")
    loans = relationship("Loan", back_populates="book_copy")


class Loan(Base):
    __tablename__ = "loans"
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    book_copy_id = Column(UUID, ForeignKey("book_copies.id"), nullable=False)
    user_id = Column(UUID, ForeignKey("users.id"), nullable=False)
    borrowed_at = Column(DateTime, default=func.now(), nullable=False)
    due_date = Column(DateTime, nullable=False)
    returned_at = Column(DateTime, nullable=True)
    fine_amount = Column(Numeric(10, 2), default=0.00, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    book_copy = relationship("BookCopy", back_populates="loans")
    user = relationship("User", back_populates="loans")
