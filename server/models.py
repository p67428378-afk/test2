import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    login_id = Column(String(255), unique=True, nullable=False)
    mobile_number = Column(String(20), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    security_question = Column(String(255), nullable=False)
    security_answer_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    otps = relationship("OTP", back_populates="user")
    password_history = relationship("PasswordHistory", back_populates="user")


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


class Manuscript(Base):
    __tablename__ = "manuscripts"
    manuscript_id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True
    )
    title = Column(String(255), nullable=True)
    abstract = Column(Text, nullable=True)
    file_path = Column(String(512), nullable=True)
    creator_id = Column(UUID(as_uuid=True), nullable=False, default=uuid.uuid4)
    status = Column(String(50), nullable=False, default="draft")
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(
        DateTime, nullable=False, default=func.now(), onupdate=func.now()
    )

    authors = relationship(
        "Author", back_populates="manuscript", cascade="all, delete-orphan"
    )
    revisions = relationship(
        "Revision", back_populates="manuscript", cascade="all, delete-orphan"
    )


class Author(Base):
    __tablename__ = "authors"
    author_id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True
    )
    manuscript_id = Column(
        UUID(as_uuid=True), ForeignKey("manuscripts.manuscript_id"), nullable=False
    )
    email = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False, default="pending")
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(
        DateTime, nullable=False, default=func.now(), onupdate=func.now()
    )

    manuscript = relationship("Manuscript", back_populates="authors")


class Revision(Base):
    __tablename__ = "revisions"
    revision_id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True
    )
    manuscript_id = Column(
        UUID(as_uuid=True), ForeignKey("manuscripts.manuscript_id"), nullable=False
    )
    reviewer_comment = Column(Text, nullable=False)
    author_rebuttal = Column(Text, nullable=True)
    text_link = Column(String(255), nullable=True)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(
        DateTime, nullable=False, default=func.now(), onupdate=func.now()
    )

    manuscript = relationship("Manuscript", back_populates="revisions")


class Stylesheet(Base):
    __tablename__ = "stylesheets"
    stylesheet_id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True
    )
    name = Column(String(100), nullable=False)
    rules = Column(JSON, nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())
