from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


class TravelRequestCreate(BaseModel):
    destination: str = Field(
        ..., min_length=1, description="Target destination (city/country)"
    )
    budget: float = Field(
        ..., gt=0, description="Daily budget numerical value (must be > 0)"
    )
    currency: str = Field(
        default="USD", description="Currency code (e.g. USD, EUR, JPY)"
    )
    interests: List[str] = Field(
        ..., min_length=1, description="List of interest tags (at least 1 required)"
    )

    @field_validator("destination")
    @classmethod
    def validate_destination_not_empty(cls, v: str) -> str:
        clean = v.strip()
        if not clean:
            raise ValueError("Destination cannot be empty or blank")
        return clean

    @field_validator("interests")
    @classmethod
    def validate_interests_not_empty(cls, v: List[str]) -> List[str]:
        cleaned = [item.strip() for item in v if item and item.strip()]
        if not cleaned:
            raise ValueError("At least one non-empty interest tag is required")
        return cleaned

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "destination": "Tokyo, Japan",
                "budget": 150.00,
                "currency": "USD",
                "interests": ["Food & Dining", "Temples & Culture"],
            }
        }
    )


class RecommendationItemSchema(BaseModel):
    id: Optional[str] = None
    title: str
    category: str
    estimated_cost: float = Field(default=0.0, ge=0)
    location: Optional[str] = None
    duration: Optional[str] = None
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class RecommendationResponse(BaseModel):
    request_id: str
    recommendation_id: str
    destination: str
    budget: float
    currency: str
    interests: List[str]
    is_fallback: bool = False
    created_at: datetime
    items: List[RecommendationItemSchema] = []

    model_config = ConfigDict(from_attributes=True)


class HealthResponse(BaseModel):
    status: str = "healthy"
    service: str = "travel-recommendation-api"
