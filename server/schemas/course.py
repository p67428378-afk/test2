from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from server.schemas.auth import UserResponse


class CourseBase(BaseModel):
    course_code: str
    title: str
    description: Optional[str] = None
    semester: str = "Fall 2026"
    is_active: bool = True


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    semester: Optional[str] = None
    is_active: Optional[bool] = None


class CourseResponse(CourseBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    instructor_id: str
    created_at: datetime
    updated_at: datetime
    instructor: Optional[UserResponse] = None
    enrollment_count: Optional[int] = 0


class CourseDetailResponse(CourseResponse):
    modules: Optional[List[dict]] = [
        {"title": "Module 1: Course Introduction", "materials": ["Syllabus.pdf"]},
        {
            "title": "Module 2: Core Concepts & Practice",
            "materials": ["Lecture_Slides.pdf", "Examples.zip"],
        },
    ]


class EnrollmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    student_id: str
    course_id: str
    enrolled_at: datetime
    course: Optional[CourseResponse] = None
    student: Optional[UserResponse] = None
