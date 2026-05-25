from pydantic import BaseModel, Field
from app.db.models import KYCStatus
from uuid import UUID
from datetime import datetime

# This is the Pydantic V2 way to configure a model, addressing the warning in your logs.
from pydantic import ConfigDict

class KYCCreate(BaseModel):
    aadhaar_number: str = Field(
        ...,
        min_length=12,
        max_length=12,
        pattern=r"^\d{12}$",
        description="Aadhaar number must be a 12-digit number."
    )
    pan_number: str = Field(
        ...,
        min_length=10,
        max_length=10,
        pattern=r"^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
        description="PAN number must be in the format ABCDE1234F."
    )

class KYCSchema(BaseModel):
    id: UUID
    aadhaar_number: str
    pan_number: str
    status: KYCStatus
    failure_reason: str | None = None
    sanctions_match: str | None = None
    created_at: datetime
    updated_at: datetime

    # Use ConfigDict for Pydantic V2 compatibility
    model_config = ConfigDict(from_attributes=True)
