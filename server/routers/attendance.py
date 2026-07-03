from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from server.database import get_db
from server import crud, schemas, models
from uuid import UUID
from datetime import date
from typing import List, Optional

router = APIRouter()


# Helper to get current user from X-User-Email header (simulating external auth/RBAC)
def get_current_user(
    x_user_email: Optional[str] = Header(None), db: Session = Depends(get_db)
):
    if not x_user_email:
        raise HTTPException(
            status_code=401, detail="Unauthorized: Missing X-User-Email header"
        )
    # Force create tables on the active session's bind
    from server.models import Base

    Base.metadata.create_all(bind=db.bind)
    user = crud.get_user_by_email(db, x_user_email)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized: User not found")
    return user


@router.post("/attendance", response_model=schemas.AttendanceMarkResponse)
def mark_attendance(
    payload: schemas.AttendanceMarkRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Enforce Teacher role
    if current_user.role != "Teacher":
        raise HTTPException(
            status_code=403, detail="Forbidden: Only teachers can mark attendance"
        )

    # Verify teacher is assigned to this class
    class_obj = (
        db.query(models.Class).filter(models.Class.id == payload.class_id).first()
    )
    if not class_obj:
        raise HTTPException(status_code=400, detail="Invalid class_id")

    if class_obj.teacher_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Forbidden: Teacher not assigned to this class"
        )

    count = crud.mark_attendance(
        db=db,
        class_id=payload.class_id,
        date_val=payload.date,
        records=payload.records,
        marked_by=current_user.id,
    )
    return {"message": "Attendance marked successfully", "processed_count": count}


@router.get("/attendance", response_model=List[schemas.AttendanceRecordResponse])
def get_attendance(
    class_id: Optional[UUID] = None,
    date: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Enforce Teacher or Principal role
    if current_user.role not in ["Teacher", "Principal"]:
        raise HTTPException(status_code=403, detail="Forbidden: Unauthorized role")

    # If teacher, verify they are assigned to the class (if class_id is provided)
    if current_user.role == "Teacher" and class_id:
        class_obj = db.query(models.Class).filter(models.Class.id == class_id).first()
        if class_obj and class_obj.teacher_id != current_user.id:
            raise HTTPException(
                status_code=403, detail="Forbidden: Teacher not assigned to this class"
            )

    records = crud.get_attendance_records(db, class_id=class_id, date_val=date)
    return records


@router.get(
    "/attendance/student/{student_id}", response_model=schemas.StudentAttendanceDetail
)
def get_student_attendance(
    student_id: UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Enforce RBAC: Principal, Teacher, or the Student themselves, or their Parent
    allowed = False
    if current_user.role in ["Principal", "Teacher"]:
        allowed = True
    elif current_user.role == "Student" and current_user.id == student_id:
        allowed = True
    elif current_user.role == "Parent":
        # Check if this parent is linked to the student
        student = db.query(models.User).filter(models.User.id == student_id).first()
        if student and student.parent_email == current_user.email:
            allowed = True

    if not allowed:
        raise HTTPException(
            status_code=403,
            detail="Forbidden: Unauthorized to view this student's profile",
        )

    detail = crud.get_student_attendance_detail(db, student_id)
    if not detail:
        raise HTTPException(status_code=404, detail="Student not found")
    return detail
