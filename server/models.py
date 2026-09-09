import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Text,
    BigInteger,
    Integer,
    Boolean,
    DateTime,
    ForeignKey,
    JSON,
    event,
)
from sqlalchemy.orm import relationship
from server.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="Investigator")
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    assigned_cases = relationship("Case", back_populates="lead_investigator")
    custody_evidence = relationship("EvidenceItem", back_populates="current_custodian")


class Case(Base):
    __tablename__ = "cases"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    case_number = Column(String(64), unique=True, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    lead_investigator_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    status = Column(String(50), default="Active", nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    lead_investigator = relationship("User", back_populates="assigned_cases")
    evidence_links = relationship(
        "CaseEvidenceLink", back_populates="case", cascade="all, delete-orphan"
    )


class EvidenceItem(Base):
    __tablename__ = "evidence_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    evidence_code = Column(String(64), unique=True, nullable=False, index=True)
    file_name = Column(String(255), nullable=False)
    file_type = Column(String(100), nullable=False)
    file_size_bytes = Column(BigInteger, nullable=False)
    sha256_hash = Column(String(64), nullable=False, index=True)
    storage_path = Column(String(512), nullable=False)
    collection_date = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    collection_location = Column(String(255), nullable=True)
    source_device = Column(String(255), nullable=True)
    current_custodian_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    current_custodian = relationship("User", back_populates="custody_evidence")
    chain_of_custody_entries = relationship(
        "ChainOfCustodyEntry",
        back_populates="evidence_item",
        cascade="all, delete-orphan",
    )
    case_links = relationship(
        "CaseEvidenceLink", back_populates="evidence_item", cascade="all, delete-orphan"
    )


class CaseEvidenceLink(Base):
    __tablename__ = "case_evidence_link"

    case_id = Column(String(36), ForeignKey("cases.id"), primary_key=True)
    evidence_id = Column(String(36), ForeignKey("evidence_items.id"), primary_key=True)
    linked_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    linked_by_id = Column(String(36), ForeignKey("users.id"), nullable=True)

    # Relationships
    case = relationship("Case", back_populates="evidence_links")
    evidence_item = relationship("EvidenceItem", back_populates="case_links")
    linked_by = relationship("User")


class ChainOfCustodyEntry(Base):
    __tablename__ = "chain_of_custody_entries"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    evidence_id = Column(
        String(36), ForeignKey("evidence_items.id"), nullable=False, index=True
    )
    previous_custodian_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    new_custodian_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    action = Column(
        String(50), nullable=False
    )  # UPLOAD, TRANSFER, VIEW, EXPORT, RELEASE
    transfer_reason = Column(Text, nullable=False)
    location_context = Column(String(255), nullable=True)
    timestamp = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )

    # Relationships
    evidence_item = relationship(
        "EvidenceItem", back_populates="chain_of_custody_entries"
    )
    previous_custodian = relationship("User", foreign_keys=[previous_custodian_id])
    new_custodian = relationship("User", foreign_keys=[new_custodian_id])


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    user_email = Column(String(255), nullable=True)
    action = Column(String(100), nullable=False, index=True)
    resource = Column(String(255), nullable=False, index=True)
    status_code = Column(Integer, nullable=False, index=True)
    ip_address = Column(String(45), nullable=False)
    details = Column(JSON, nullable=True)
    timestamp = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )

    # Relationships
    user = relationship("User")


# Immutability triggers / event listeners preventing update or delete on chain_of_custody_entries and audit_logs
@event.listens_for(ChainOfCustodyEntry, "before_update")
def prevent_custody_update(mapper, connection, target):
    raise ValueError(
        "TAMPER ERROR: Chain-of-custody entries are immutable and cannot be updated."
    )


@event.listens_for(ChainOfCustodyEntry, "before_delete")
def prevent_custody_delete(mapper, connection, target):
    raise ValueError(
        "TAMPER ERROR: Chain-of-custody entries are immutable and cannot be deleted."
    )


@event.listens_for(AuditLog, "before_update")
def prevent_audit_update(mapper, connection, target):
    raise ValueError("TAMPER ERROR: Audit logs are immutable and cannot be updated.")


@event.listens_for(AuditLog, "before_delete")
def prevent_audit_delete(mapper, connection, target):
    raise ValueError("TAMPER ERROR: Audit logs are immutable and cannot be deleted.")
