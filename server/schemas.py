from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import date, datetime
from uuid import UUID


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: str
    parent_email: Optional[EmailStr] = None
    parent_phone: Optional[str] = None


class UserCreate(UserBase):
    pass


class UserResponse(UserBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Class Schemas
class ClassBase(BaseModel):
    name: str
    grade: str
    teacher_id: UUID


class ClassCreate(ClassBase):
    pass


class ClassResponse(ClassBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


# Attendance Schemas
class AttendanceRecordItem(BaseModel):
    student_id: UUID
    status: str = Field(..., pattern="^(Present|Absent|Late)$")


class AttendanceMarkRequest(BaseModel):
    class_id: UUID
    date: date
    records: List[AttendanceRecordItem]


class AttendanceMarkResponse(BaseModel):
    message: str
    processed_count: int


class AttendanceRecordResponse(BaseModel):
    id: UUID
    student_id: UUID
    student_name: str
    class_id: UUID
    status: str
    roll_no: Optional[str] = None
    timestamp: datetime
    last_notification: Optional[str] = None

    class Config:
        from_attributes = True


# Student Attendance Detail Schemas
class CalendarItem(BaseModel):
    date: date
    status: str


class NotificationItem(BaseModel):
    id: UUID
    sent_at: datetime
    status: str
    type: str


class StudentAttendanceDetail(BaseModel):
    student_id: UUID
    student_name: str
    total_days: int
    absences: int
    lates: int
    attendance_rate: float
    calendar: List[CalendarItem]
    notifications: List[NotificationItem]


# Report Schemas
class TrendItem(BaseModel):
    date: date
    rate: float


class WatchlistItem(BaseModel):
    student_id: UUID
    student_name: str
    class_name: str
    rate: float


class SchoolReportResponse(BaseModel):
    total_students: int
    attendance_rate: float
    absent_today: int
    unexcused: int
    trends: List[TrendItem]
    watchlist: List[WatchlistItem]
