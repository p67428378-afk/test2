from datetime import datetime, date
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, field_validator, ConfigDict


# ----------------------------------------------------
# Excavation Site Schemas
# ----------------------------------------------------
class SiteBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Unique excavation site name")
    site_code: str = Field(..., min_length=1, max_length=100, description="Unique alphanumeric site code")
    region: str = Field(..., min_length=1, max_length=255, description="Geographical or administrative region")
    historical_period: str = Field(..., min_length=1, max_length=255, description="Historical or archaeological era")
    latitude: float = Field(..., description="GPS latitude in decimal degrees [-90, 90]")
    longitude: float = Field(..., description="GPS longitude in decimal degrees [-180, 180]")
    altitude_meters: Optional[float] = Field(None, description="Altitude in meters above sea level")
    description: Optional[str] = Field(None, description="Detailed site notes and landscape description")

    @field_validator("latitude")
    @classmethod
    def validate_latitude(cls, v: float) -> float:
        if v < -90.0 or v > 90.0:
            raise ValueError("Latitude must be between -90.0 and 90.0 degrees")
        return v

    @field_validator("longitude")
    @classmethod
    def validate_longitude(cls, v: float) -> float:
        if v < -180.0 or v > 180.0:
            raise ValueError("Longitude must be between -180.0 and 180.0 degrees")
        return v


class SiteCreate(SiteBase):
    pass


class SiteUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    site_code: Optional[str] = Field(None, min_length=1, max_length=100)
    region: Optional[str] = Field(None, min_length=1, max_length=255)
    historical_period: Optional[str] = Field(None, min_length=1, max_length=255)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    altitude_meters: Optional[float] = None
    description: Optional[str] = None

    @field_validator("latitude")
    @classmethod
    def validate_latitude(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and (v < -90.0 or v > 90.0):
            raise ValueError("Latitude must be between -90.0 and 90.0 degrees")
        return v

    @field_validator("longitude")
    @classmethod
    def validate_longitude(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and (v < -180.0 or v > 180.0):
            raise ValueError("Longitude must be between -180.0 and 180.0 degrees")
        return v


class SiteResponse(SiteBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SiteListResponse(BaseModel):
    items: List[SiteResponse]
    total: int
    skip: int
    limit: int


# ----------------------------------------------------
# Excavation Team & Member Schemas
# ----------------------------------------------------
class TeamMemberBase(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=255)
    role: str = Field(..., description="Role: Director, Archaeologist, Field Assistant, Lab Specialist")
    email: str = Field(..., min_length=3, max_length=255)
    phone: Optional[str] = None


class TeamMemberCreate(TeamMemberBase):
    team_id: Optional[str] = None


class TeamMemberResponse(TeamMemberBase):
    id: str
    team_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TeamBase(BaseModel):
    team_name: str = Field(..., min_length=1, max_length=255)
    site_id: Optional[str] = None


class TeamCreate(TeamBase):
    pass


class TeamResponse(TeamBase):
    id: str
    created_at: datetime
    updated_at: datetime
    members: List[TeamMemberResponse] = []

    model_config = ConfigDict(from_attributes=True)


class TeamListResponse(BaseModel):
    items: List[TeamResponse]
    total: int
    skip: int
    limit: int


# ----------------------------------------------------
# Discovered Artifact Schemas
# ----------------------------------------------------
class ArtifactBase(BaseModel):
    site_id: str = Field(..., description="UUID of the parent excavation site")
    artifact_code: str = Field(..., min_length=1, max_length=100, description="Unique artifact catalog code")
    material: str = Field(..., min_length=1, max_length=100, description="Material: Ceramic, Bronze, Lithic, Bone, Organic, etc.")
    context_layer: str = Field(..., min_length=1, max_length=100, description="Archaeological stratum layer")
    depth_meters: float = Field(..., ge=0.0, description="Depth from surface datum in meters")
    excavation_date: date = Field(..., description="Discovery date")
    finder_member_id: Optional[str] = Field(None, description="UUID of discoverer team member")
    description: Optional[str] = None


class ArtifactCreate(ArtifactBase):
    pass


class ArtifactUpdate(BaseModel):
    site_id: Optional[str] = None
    artifact_code: Optional[str] = None
    material: Optional[str] = None
    context_layer: Optional[str] = None
    depth_meters: Optional[float] = Field(None, ge=0.0)
    excavation_date: Optional[date] = None
    finder_member_id: Optional[str] = None
    description: Optional[str] = None


class ArtifactResponse(ArtifactBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ArtifactDetailResponse(ArtifactResponse):
    site: Optional[SiteResponse] = None
    finder: Optional[TeamMemberResponse] = None

    model_config = ConfigDict(from_attributes=True)


class ArtifactListResponse(BaseModel):
    items: List[ArtifactResponse]
    total: int
    skip: int
    limit: int


# ----------------------------------------------------
# Media Asset Schemas
# ----------------------------------------------------
class MediaAssetBase(BaseModel):
    site_id: Optional[str] = None
    artifact_id: Optional[str] = None
    lab_analysis_id: Optional[str] = None
    file_name: str = Field(..., min_length=1, max_length=255)
    file_url: str = Field(..., min_length=1, max_length=1000)
    media_type: str = Field(..., min_length=1, max_length=100)
    file_size_bytes: int = Field(..., ge=0)
    caption: Optional[str] = None
    camera_metadata: Optional[Dict[str, Any]] = None


class MediaAssetCreate(MediaAssetBase):
    pass


class MediaAssetResponse(MediaAssetBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MediaAssetListResponse(BaseModel):
    items: List[MediaAssetResponse]
    total: int
    skip: int
    limit: int


# ----------------------------------------------------
# Laboratory Analysis Schemas
# ----------------------------------------------------
class LabAnalysisBase(BaseModel):
    artifact_id: str = Field(..., description="UUID of artifact under testing")
    test_type: str = Field(..., min_length=1, max_length=100, description="Test: Radiocarbon C-14, XRF Spectrometry, Petrographic Analysis")
    lab_name: str = Field(..., min_length=1, max_length=255, description="Performing laboratory name")
    status: str = Field("Pending", description="Workflow status: Pending, In-Progress, Completed")
    request_date: date = Field(..., description="Date analysis was requested")
    completion_date: Optional[date] = None
    result_summary: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        valid_statuses = {"Pending", "In-Progress", "Completed"}
        if v not in valid_statuses:
            raise ValueError(f"Status must be one of: {', '.join(sorted(valid_statuses))}")
        return v


class LabAnalysisCreate(LabAnalysisBase):
    pass


class LabAnalysisUpdate(BaseModel):
    test_type: Optional[str] = None
    lab_name: Optional[str] = None
    status: Optional[str] = None
    request_date: Optional[date] = None
    completion_date: Optional[date] = None
    result_summary: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            valid_statuses = {"Pending", "In-Progress", "Completed"}
            if v not in valid_statuses:
                raise ValueError(f"Status must be one of: {', '.join(sorted(valid_statuses))}")
        return v


class LabAnalysisResponse(LabAnalysisBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LabAnalysisListResponse(BaseModel):
    items: List[LabAnalysisResponse]
    total: int
    skip: int
    limit: int


# ----------------------------------------------------
# Publication Schemas
# ----------------------------------------------------
class PublicationBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    authors: str = Field(..., min_length=1, max_length=500)
    journal_publisher: str = Field(..., min_length=1, max_length=255)
    publication_date: date
    doi: Optional[str] = Field(None, max_length=255)


class PublicationCreate(PublicationBase):
    artifact_ids: Optional[List[str]] = Field(default=[], description="List of artifact UUIDs to link")


class PublicationLinkRequest(BaseModel):
    publication_id: str = Field(..., description="UUID of publication")
    artifact_id: str = Field(..., description="UUID of artifact")


class PublicationResponse(PublicationBase):
    id: str
    created_at: datetime
    updated_at: datetime
    linked_artifact_ids: List[str] = []

    model_config = ConfigDict(from_attributes=True)


class PublicationListResponse(BaseModel):
    items: List[PublicationResponse]
    total: int
    skip: int
    limit: int


# ----------------------------------------------------
# Dashboard & Analytics Schemas
# ----------------------------------------------------
class DashboardMetricsResponse(BaseModel):
    active_sites_count: int
    cataloged_artifacts_count: int
    excavation_teams_count: int
    team_members_count: int
    pending_lab_tests_count: int
    in_progress_lab_tests_count: int
    completed_lab_tests_count: int
    total_publications_count: int
    total_photos_count: int
