import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    role = Column(
        String(50), nullable=False
    )  # 'Teacher', 'Principal', 'Student', 'Parent'
    parent_email = Column(String(255), nullable=True)
    parent_phone = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    classes = relationship("Class", back_populates="teacher")
    attendance_records = relationship(
        "AttendanceRecord",
        back_populates="student",
        foreign_keys="[AttendanceRecord.student_id]",
    )
    marked_records = relationship(
        "AttendanceRecord",
        back_populates="marker",
        foreign_keys="[AttendanceRecord.marked_by]",
    )


class Class(Base):
    __tablename__ = "classes"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    grade = Column(String(50), nullable=False)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    # Relationships
    teacher = relationship("User", back_populates="classes")
    attendance_records = relationship("AttendanceRecord", back_populates="class_")


class AttendanceRecord(Base):
    __tablename__ = "attendancerecords"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    class_id = Column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=False)
    status = Column(String(20), nullable=False)  # 'Present', 'Absent', 'Late'
    date = Column(Date, nullable=False)
    timestamp = Column(DateTime, default=func.now(), nullable=False)
    marked_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    # Relationships
    student = relationship(
        "User", back_populates="attendance_records", foreign_keys=[student_id]
    )
    class_ = relationship("Class", back_populates="attendance_records")
    marker = relationship(
        "User", back_populates="marked_records", foreign_keys=[marked_by]
    )
    notifications = relationship("Notification", back_populates="attendance_record")


class Notification(Base):
    __tablename__ = "notifications"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    attendance_record_id = Column(
        UUID(as_uuid=True), ForeignKey("attendancerecords.id"), nullable=False
    )
    recipient = Column(String(255), nullable=False)
    type = Column(String(20), nullable=False)  # 'SMS', 'Email'
    status = Column(String(50), nullable=False)  # 'Sent', 'Failed'
    sent_at = Column(DateTime, default=func.now(), nullable=False)

    # Relationships
    attendance_record = relationship("AttendanceRecord", back_populates="notifications")
