from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.user import User
from server.models.enrollment import Enrollment
from server.schemas.course import EnrollmentResponse
from server.security import get_current_user

router = APIRouter(prefix="/enrollments", tags=["Enrollments"])


@router.get("/my", response_model=List[EnrollmentResponse])
def get_my_enrollments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    enrollments = (
        db.query(Enrollment).filter(Enrollment.student_id == current_user.id).all()
    )
    return enrollments


@router.get("", response_model=List[EnrollmentResponse])
@router.get("/", response_model=List[EnrollmentResponse], include_in_schema=False)
def list_enrollments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role == "faculty":
        enrollments = db.query(Enrollment).all()
    else:
        enrollments = (
            db.query(Enrollment).filter(Enrollment.student_id == current_user.id).all()
        )
    return enrollments


@router.delete("/{course_id}", status_code=status.HTTP_200_OK)
def drop_course(
    course_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    enrollment = (
        db.query(Enrollment)
        .filter(
            Enrollment.student_id == current_user.id, Enrollment.course_id == course_id
        )
        .first()
    )
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enrollment not found",
        )
    db.delete(enrollment)
    db.commit()
    return {"message": "Successfully dropped the course"}
