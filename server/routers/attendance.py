from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.attendance import AttendanceLog
from server.models.session import Session as SessionModel
from server.models.user import User
from server.schemas.attendance import CheckInRequest, AttendanceLogResponse
from server.dependencies.auth import get_current_user

router = APIRouter(prefix="/api/v1/attendance", tags=["attendance"])


@router.post(
    "/check-in",
    response_model=AttendanceLogResponse,
    status_code=status.HTTP_201_CREATED,
)
def check_in_attendee(
    check_in_in: CheckInRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sess = (
        db.query(SessionModel).filter(SessionModel.id == check_in_in.session_id).first()
    )
    if not sess:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    attendee = db.query(User).filter(User.id == check_in_in.attendee_id).first()
    if not attendee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attendee user not found",
        )

    log_entry = AttendanceLog(
        session_id=check_in_in.session_id,
        attendee_id=check_in_in.attendee_id,
        checked_in_by=current_user.id,
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    return log_entry


@router.get("/session/{session_id}", response_model=List[AttendanceLogResponse])
def get_session_attendance(session_id: str, db: Session = Depends(get_db)):
    sess = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not sess:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )
    logs = db.query(AttendanceLog).filter(AttendanceLog.session_id == session_id).all()
    return logs
