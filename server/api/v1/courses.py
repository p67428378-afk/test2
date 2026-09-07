import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.user import User
from server.models.course import Course
from server.models.enrollment import Enrollment
from server.models.assignment import Assignment
from server.schemas.course import (
    CourseCreate,
    CourseUpdate,
    CourseResponse,
    CourseDetailResponse,
    EnrollmentResponse,
)
from server.schemas.assignment import AssignmentResponse
from server.security import get_current_user, require_role

router = APIRouter(prefix="/courses", tags=["Courses"])


@router.get("", response_model=List[CourseResponse])
@router.get("/", response_model=List[CourseResponse], include_in_schema=False)
def list_courses(
    search: Optional[str] = None,
    semester: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Course)
    if search:
        query = query.filter(
            (Course.title.ilike(f"%{search}%"))
            | (Course.course_code.ilike(f"%{search}%"))
        )
    if semester:
        query = query.filter(Course.semester == semester)

    courses = query.offset(skip).limit(limit).all()
    results = []
    for c in courses:
        res = CourseResponse.model_validate(c)
        res.enrollment_count = (
            db.query(Enrollment).filter(Enrollment.course_id == c.id).count()
        )
        results.append(res)
    return results


@router.post("", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
@router.post(
    "/",
    response_model=CourseResponse,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False,
)
def create_course(
    course_in: CourseCreate,
    current_user: User = Depends(require_role("faculty")),
    db: Session = Depends(get_db),
):
    existing = (
        db.query(Course)
        .filter(Course.course_code == course_in.course_code.upper())
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Course code '{course_in.course_code}' already exists",
        )

    course = Course(
        id=str(uuid.uuid4()),
        course_code=course_in.course_code.upper(),
        title=course_in.title,
        description=course_in.description,
        instructor_id=current_user.id,
        semester=course_in.semester,
        is_active=course_in.is_active,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    res = CourseResponse.model_validate(course)
    res.enrollment_count = 0
    return res


@router.get("/{course_id}", response_model=CourseDetailResponse)
def get_course(course_id: str, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )
    res = CourseDetailResponse.model_validate(course)
    res.enrollment_count = (
        db.query(Enrollment).filter(Enrollment.course_id == course.id).count()
    )
    return res


@router.put("/{course_id}", response_model=CourseResponse)
def update_course(
    course_id: str,
    course_in: CourseUpdate,
    current_user: User = Depends(require_role("faculty")),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )
    if course.instructor_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to update this course",
        )

    if course_in.title is not None:
        course.title = course_in.title
    if course_in.description is not None:
        course.description = course_in.description
    if course_in.semester is not None:
        course.semester = course_in.semester
    if course_in.is_active is not None:
        course.is_active = course_in.is_active
    course.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(course)
    res = CourseResponse.model_validate(course)
    res.enrollment_count = (
        db.query(Enrollment).filter(Enrollment.course_id == course.id).count()
    )
    return res


@router.post(
    "/{course_id}/enroll",
    response_model=EnrollmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def enroll_in_course(
    course_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )

    if not course.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Course enrollment is closed or course is inactive",
        )

    existing_enrollment = (
        db.query(Enrollment)
        .filter(
            Enrollment.student_id == current_user.id, Enrollment.course_id == course.id
        )
        .first()
    )
    if existing_enrollment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student is already enrolled in this course",
        )

    enrollment = Enrollment(
        id=str(uuid.uuid4()),
        student_id=current_user.id,
        course_id=course.id,
        enrolled_at=datetime.now(timezone.utc),
    )
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment


@router.get("/{course_id}/assignments", response_model=List[AssignmentResponse])
def list_course_assignments(course_id: str, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )
    assignments = db.query(Assignment).filter(Assignment.course_id == course_id).all()
    return assignments


@router.get("/{course_id}/roster", response_model=List[EnrollmentResponse])
def get_course_roster(
    course_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )
    enrollments = db.query(Enrollment).filter(Enrollment.course_id == course_id).all()
    return enrollments
