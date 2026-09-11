import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Boolean,
    Integer,
    Float,
    Text,
    Date,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship, backref
from server.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(
        String(64), nullable=False
    )  # procurement_admin, legal_approver, finance_approver, vendor_representative
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )


class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    contact_email = Column(String(255), nullable=False)
    status = Column(String(64), default="Active", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    contracts = relationship("Contract", back_populates="vendor")


class Contract(Base):
    __tablename__ = "contracts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    contract_number = Column(String(64), unique=True, index=True, nullable=False)
    vendor_id = Column(String(36), ForeignKey("vendors.id"), nullable=False)
    title = Column(String(255), nullable=False)
    status = Column(String(64), default="Draft", index=True, nullable=False)
    current_version = Column(String(16), default="v1.0", nullable=False)
    version_number = Column(Integer, default=1, nullable=False)
    effective_date = Column(Date, nullable=False)
    termination_date = Column(Date, index=True, nullable=False)
    total_value = Column(Float, default=0.0, nullable=False)
    terms = Column(Text, nullable=True)
    document_url = Column(String(512), nullable=True)
    created_by = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    vendor = relationship("Vendor", back_populates="contracts")
    creator = relationship("User")
    versions = relationship(
        "ContractVersion", back_populates="contract", cascade="all, delete-orphan"
    )
    comments = relationship(
        "ContractComment", back_populates="contract", cascade="all, delete-orphan"
    )
    workflow_histories = relationship(
        "WorkflowHistory", back_populates="contract", cascade="all, delete-orphan"
    )
    renewal_reminders = relationship(
        "RenewalReminder", back_populates="contract", cascade="all, delete-orphan"
    )


class ContractVersion(Base):
    __tablename__ = "contract_versions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    contract_id = Column(
        String(36), ForeignKey("contracts.id"), index=True, nullable=False
    )
    version_string = Column(String(16), nullable=False)
    version_number = Column(Integer, nullable=False)
    terms_content = Column(Text, nullable=True)
    document_url = Column(String(512), nullable=True)
    change_summary = Column(Text, nullable=True)
    created_by = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    contract = relationship("Contract", back_populates="versions")
    creator = relationship("User")


class ContractComment(Base):
    __tablename__ = "contract_comments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    contract_id = Column(
        String(36), ForeignKey("contracts.id"), index=True, nullable=False
    )
    parent_id = Column(String(36), ForeignKey("contract_comments.id"), nullable=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    clause_reference = Column(String(255), nullable=True)
    content = Column(Text, nullable=False)
    is_internal_only = Column(Boolean, default=False, nullable=False)
    is_locked = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    contract = relationship("Contract", back_populates="comments")
    user = relationship("User")
    replies = relationship(
        "ContractComment", backref=backref("parent", remote_side=[id])
    )


class WorkflowHistory(Base):
    __tablename__ = "workflow_history"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    contract_id = Column(
        String(36), ForeignKey("contracts.id"), index=True, nullable=False
    )
    action = Column(String(64), nullable=False)
    from_stage = Column(String(64), nullable=True)
    to_stage = Column(String(64), nullable=True)
    actor_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    remarks = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    contract = relationship("Contract", back_populates="workflow_histories")
    actor = relationship("User")


class RenewalReminder(Base):
    __tablename__ = "renewal_reminders"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    contract_id = Column(
        String(36), ForeignKey("contracts.id"), index=True, nullable=False
    )
    reminder_stage_days = Column(Integer, nullable=False)
    recipient_email = Column(String(255), nullable=False)
    status = Column(String(64), default="SENT", nullable=False)
    sent_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    contract = relationship("Contract", back_populates="renewal_reminders")
