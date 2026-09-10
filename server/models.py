import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Table, Boolean
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

# Association table for note_tags
note_tags = Table(
    "note_tags",
    Base.metadata,
    Column(
        "note_id",
        String(36),
        ForeignKey("research_notes.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "tag_id",
        String(36),
        ForeignKey("tags.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(
        String(50), default="ROLE_EMPLOYEE", nullable=False
    )  # ROLE_EMPLOYEE or ROLE_EXPERT
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    notes = relationship("ResearchNote", back_populates="author")
    reviews = relationship("Review", back_populates="reviewer")


class Tag(Base):
    __tablename__ = "tags"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    notes = relationship("ResearchNote", secondary=note_tags, back_populates="tags")


class Citation(Base):
    __tablename__ = "citations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    note_id = Column(
        String(36), ForeignKey("research_notes.id", ondelete="CASCADE"), nullable=False
    )
    title = Column(String(255), nullable=False)
    url = Column(Text, nullable=False)
    citation_type = Column(String(50), default="EXTERNAL")  # CONFLUENCE or EXTERNAL
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    note = relationship("ResearchNote", back_populates="citations")


class ResearchNote(Base):
    __tablename__ = "research_notes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False, index=True)
    body = Column(Text, nullable=False)
    category = Column(String(100), default="General", nullable=False)
    status = Column(
        String(50), default="PENDING", index=True, nullable=False
    )  # PENDING, APPROVED, REJECTED
    author_id = Column(
        String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    author = relationship("User", back_populates="notes")
    tags = relationship("Tag", secondary=note_tags, back_populates="notes")
    citations = relationship(
        "Citation", back_populates="note", cascade="all, delete-orphan"
    )
    reviews = relationship(
        "Review", back_populates="note", cascade="all, delete-orphan"
    )


class Review(Base):
    __tablename__ = "reviews"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    note_id = Column(
        String(36), ForeignKey("research_notes.id", ondelete="CASCADE"), nullable=False
    )
    reviewer_id = Column(
        String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    action = Column(String(50), nullable=False)  # APPROVE, REJECT
    feedback = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    note = relationship("ResearchNote", back_populates="reviews")
    reviewer = relationship("User", back_populates="reviews")
