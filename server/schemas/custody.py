from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class StorageContainerBase(BaseModel):
    container_code: str = Field(..., min_length=1, max_length=100)
    room_name: str = Field(..., min_length=1, max_length=100)
    rack_number: str = Field(..., min_length=1, max_length=50)
    bin_number: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = None


class StorageContainerCreate(StorageContainerBase):
    pass


class StorageContainerResponse(StorageContainerBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CustodyTransferCreate(BaseModel):
    artifact_id: str
    container_id: Optional[str] = None
    releasing_custodian_id: Optional[str] = None
    receiving_custodian_id: str
    notes: Optional[str] = None


class CustodyTransferResponse(BaseModel):
    id: str
    artifact_id: str
    artifact_code: Optional[str] = None
    container_id: Optional[str] = None
    container_code: Optional[str] = None
    room_name: Optional[str] = None
    rack_number: Optional[str] = None
    bin_number: Optional[str] = None
    releasing_custodian_id: Optional[str] = None
    releasing_custodian_name: Optional[str] = None
    receiving_custodian_id: str
    receiving_custodian_name: Optional[str] = None
    transfer_timestamp: datetime
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
