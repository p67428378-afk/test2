import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


class StorageContainer(Base):
    __tablename__ = "storage_containers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    container_code = Column(String(100), unique=True, nullable=False, index=True)
    room_name = Column(String(100), nullable=False)
    rack_number = Column(String(50), nullable=False)
    bin_number = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    custody_transfers = relationship("CustodyTransfer", back_populates="container")


class CustodyTransfer(Base):
    __tablename__ = "custody_transfers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    artifact_id = Column(String(36), ForeignKey("discovered_artifacts.id", ondelete="CASCADE"), nullable=False, index=True)
    container_id = Column(String(36), ForeignKey("storage_containers.id", ondelete="SET NULL"), nullable=True, index=True)
    releasing_custodian_id = Column(String(36), ForeignKey("team_members.id", ondelete="SET NULL"), nullable=True)
    receiving_custodian_id = Column(String(36), ForeignKey("team_members.id", ondelete="CASCADE"), nullable=False)
    transfer_timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    artifact = relationship("DiscoveredArtifact", back_populates="custody_transfers")
    container = relationship("StorageContainer", back_populates="custody_transfers")
    releasing_custodian = relationship("TeamMember", foreign_keys=[releasing_custodian_id])
    receiving_custodian = relationship("TeamMember", foreign_keys=[receiving_custodian_id])
