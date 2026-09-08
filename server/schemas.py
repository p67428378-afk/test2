from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class TravelRequestCreate(BaseModel):
    destination: str = Field(
        ..., min_length=1, description="Target destination city/country"
    )
    budget: float = Field(..., gt=0, description="Numerical budget constraint")
    currency: str = Field(
        default="USD", description="Currency code (e.g. USD, EUR, JPY)"
    )
    interests: list[str] = Field(
        default_factory=list, description="List of interest categories"
    )


class TravelRequestResponse(BaseModel):
    id: str
    destination: str
    budget: float
    currency: str
    interests: list[str] | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class RecommendationItemBase(BaseModel):
    title: str
    category: str
    estimated_cost: float = 0.0
    location: str | None = None
    duration: str | None = None
    description: str | None = None


class RecommendationItemResponse(RecommendationItemBase):
    id: str
    recommendation_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class RecommendationResponse(BaseModel):
    id: str
    request_id: str
    is_fallback: bool
    created_at: datetime
    request: TravelRequestResponse | None = None
    items: list[RecommendationItemResponse] = Field(default_factory=list)
    total_estimated_cost: float = 0.0

    model_config = ConfigDict(from_attributes=True)


class ExportRequest(BaseModel):
    recommendation_id: str = Field(..., min_length=1)
    export_format: str = Field(
        default="json", description="Export format: json, pdf, or link"
    )
    include_cost_summary: bool | None = Field(default=True)


class ExportResponse(BaseModel):
    export_id: str
    recommendation_id: str
    file_name: str
    mime_type: str
    content_base64: str
    share_url: str

    model_config = ConfigDict(from_attributes=True)


class CodebaseReport(BaseModel):
    issue_key: str
    repo_url: str
    branch_analyzed: str
    analyzed_at: str
    status: str
    tech_stack: dict[str, Any]
    metrics: dict[str, Any]


class CodebaseAnalysisRunRequest(BaseModel):
    issue_key: str | None = Field(default="SCRUM-231")
    repo_url: str | None = Field(default="https://github.com/p67428378-afk/test2")
    branch_name: str | None = Field(default="staging/ISSUE-SCRUM-231")


class CodebaseAnalysisRunResponse(BaseModel):
    id: str
    issue_key: str
    repo_url: str
    branch_name: str
    status: str
    report_gcs_path: str | None = None
    triggered_at: datetime
    completed_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
