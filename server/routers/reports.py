from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from server.database import get_db
from server import schemas, models
from datetime import date, timedelta
from typing import Optional, List
from uuid import UUID

router = APIRouter()


# Helper to get current user from X-User-Email header
def get_current_user(
    x_user_email: Optional[str] = Header(None), db: Session = Depends(get_db)
):
    if not x_user_email:
        raise HTTPException(
            status_code=401, detail="Unauthorized: Missing X-User-Email header"
        )
    user = db.query(models.User).filter(models.User.email == x_user_email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized: User not found")
    return user


@router.get("/reports/school", response_model=schemas.SchoolReportResponse)
def get_school_report(
    class_id: Optional[UUID] = None,
    grade: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Enforce Principal role
    if current_user.role != "Principal":
        raise HTTPException(
            status_code=403,
            detail="Forbidden: Only principals can access school-wide reports",
        )

    # Base queries
    students_query = db.query(models.User).filter(models.User.role == "Student")

    total_students = students_query.count()

    # Attendance records query
    records_query = db.query(models.AttendanceRecord)
    if class_id:
        records_query = records_query.filter(
            models.AttendanceRecord.class_id == class_id
        )

    # Filter by date range
    if start_date:
        records_query = records_query.filter(models.AttendanceRecord.date >= start_date)
    if end_date:
        records_query = records_query.filter(models.AttendanceRecord.date <= end_date)

    records = records_query.all()
    total_records = len(records)

    presents = sum(1 for r in records if r.status == "Present")
    lates = sum(1 for r in records if r.status == "Late")
    absents = sum(1 for r in records if r.status == "Absent")

    attendance_rate = (
        100.0 if total_records == 0 else ((presents + lates) / total_records) * 100.0
    )

    # Absent today (using current date or latest date in records)
    today = date.today()
    absent_today = (
        db.query(models.AttendanceRecord)
        .filter(
            models.AttendanceRecord.date == today,
            models.AttendanceRecord.status == "Absent",
        )
        .count()
    )

    # Unexcused absences (let's assume all absences are unexcused for simplicity)
    unexcused = absents

    # Trends (last 7 days)
    trends = []
    for i in range(6, -1, -1):
        d = today - timedelta(days=i)
        day_records = (
            db.query(models.AttendanceRecord)
            .filter(models.AttendanceRecord.date == d)
            .all()
        )
        if day_records:
            day_presents = sum(1 for r in day_records if r.status == "Present")
            day_lates = sum(1 for r in day_records if r.status == "Late")
            day_rate = ((day_presents + day_lates) / len(day_records)) * 100.0
        else:
            day_rate = 100.0
        trends.append({"date": d, "rate": round(day_rate, 2)})

    # Watchlist (students with attendance rate < 85%)
    watchlist = []
    students = db.query(models.User).filter(models.User.role == "Student").all()
    for s in students:
        s_records = (
            db.query(models.AttendanceRecord)
            .filter(models.AttendanceRecord.student_id == s.id)
            .all()
        )
        if s_records:
            s_presents = sum(1 for r in s_records if r.status == "Present")
            s_lates = sum(1 for r in s_records if r.status == "Late")
            s_rate = ((s_presents + s_lates) / len(s_records)) * 100.0
            if s_rate < 85.0:
                # Find class name
                first_record = s_records[0]
                class_name = (
                    first_record.class_.name if first_record.class_ else "Unknown"
                )
                watchlist.append(
                    {
                        "student_id": s.id,
                        "student_name": s.name,
                        "class_name": class_name,
                        "rate": round(s_rate, 2),
                    }
                )

    return {
        "total_students": total_students,
        "attendance_rate": round(attendance_rate, 2),
        "absent_today": absent_today,
        "unexcused": unexcused,
        "trends": trends,
        "watchlist": watchlist,
    }


@router.get("/teacher/classes", response_model=List[schemas.ClassResponse])
def get_teacher_classes(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    # Enforce Teacher role
    if current_user.role != "Teacher":
        raise HTTPException(
            status_code=403, detail="Forbidden: Only teachers can view assigned classes"
        )
    classes = (
        db.query(models.Class).filter(models.Class.teacher_id == current_user.id).all()
    )
    return classes
