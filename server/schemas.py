from datetime import datetime
from typing import Optional, List, Literal
from pydantic import BaseModel, ConfigDict, Field


# Topic Schemas
class TopicBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    estimated_minutes: int = Field(default=60, gt=0)
    difficulty: Literal["Easy", "Medium", "Hard"] = "Medium"
    status: Literal["Not Started", "In Progress", "Completed"] = "Not Started"


class TopicCreate(BaseModel):
    subject_id: str
    title: str = Field(..., min_length=1, max_length=255)
    estimated_minutes: int = Field(default=60, gt=0)
    difficulty: Literal["Easy", "Medium", "Hard"] = "Medium"
    status: Optional[Literal["Not Started", "In Progress", "Completed"]] = "Not Started"


class TopicUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    estimated_minutes: Optional[int] = Field(None, gt=0)
    difficulty: Optional[Literal["Easy", "Medium", "Hard"]] = None
    status: Optional[Literal["Not Started", "In Progress", "Completed"]] = None


class TopicStatusUpdate(BaseModel):
    status: Literal["Not Started", "In Progress", "Completed"]


class TopicResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    subject_id: str
    title: str
    estimated_minutes: int
    difficulty: str
    status: str
    created_at: datetime
    updated_at: datetime


# Subject Schemas
class SubjectBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    target_exam_date: Optional[datetime] = None


class SubjectCreate(SubjectBase):
    pass


class SubjectUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    target_exam_date: Optional[datetime] = None


class SubjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    description: Optional[str] = None
    target_exam_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    total_topics: int = 0
    completed_topics: int = 0
    progress_percentage: float = 0.0


class SubjectDetailResponse(SubjectResponse):
    topics: List[TopicResponse] = []


class SubjectProgressResponse(BaseModel):
    subject_id: str
    title: str
    total_topics: int
    completed_topics: int
    progress_percentage: float


# Study Schedule Schemas
class StudyScheduleBase(BaseModel):
    topic_id: str
    scheduled_date: datetime
    duration_minutes: int = Field(default=60, gt=0)
    is_completed: bool = False


class StudyScheduleCreate(BaseModel):
    topic_id: str
    scheduled_date: datetime
    duration_minutes: int = Field(default=60, gt=0)
    is_completed: Optional[bool] = False
    subject_id: Optional[str] = None


class StudyScheduleUpdate(BaseModel):
    scheduled_date: Optional[datetime] = None
    duration_minutes: Optional[int] = Field(None, gt=0)
    is_completed: Optional[bool] = None


class StudyScheduleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    topic_id: str
    scheduled_date: datetime
    duration_minutes: int
    is_completed: bool
    created_at: datetime
    updated_at: datetime
    topic: Optional[TopicResponse] = None


# Daily Goal Schemas
class DailyGoalBase(BaseModel):
    target_date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    target_minutes: int = Field(default=120, gt=0)


class DailyGoalCreate(DailyGoalBase):
    pass


class DailyGoalResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    target_date: str
    target_minutes: int
    scheduled_minutes: int = 0
    completed_minutes: int = 0
    goal_met: bool = False
    created_at: datetime
    updated_at: datetime


# Study Log Schemas
class StudyLogBase(BaseModel):
    topic_id: str
    session_minutes: int = Field(..., gt=0)
    notes: Optional[str] = None


class StudyLogCreate(StudyLogBase):
    logged_at: Optional[datetime] = None


class StudyLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    topic_id: str
    session_minutes: int
    notes: Optional[str] = None
    logged_at: datetime
    created_at: datetime


# Recommendation Schemas
class TopicRecommendation(BaseModel):
    topic_id: str
    topic_title: str
    subject_title: str
    difficulty: str
    estimated_minutes: int
    priority_score: float
    recommendation_reason: str


class RecommendationsResponse(BaseModel):
    recommendations: List[TopicRecommendation]
